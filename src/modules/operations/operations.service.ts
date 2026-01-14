import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Operations,
  StatutOperation,
  TypeOperation,
} from './entities/operations.entity';
import {
  Propriete,
  StatutPropriete,
} from '../properties/entities/propriete.entity';
import { Client } from '../users/entities/client.entity';
import { CreateOperationDto } from './dto/create-operation.dto';
import { Contrat, StatutContrat } from './entities/contrat.entity';
import { ConfirmOperationDto } from './dto/confirm-operation.dto';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operations)
    private readonly operationRepo: Repository<Operations>,
    @InjectRepository(Propriete)
    private readonly proprieteRepo: Repository<Propriete>,
    @InjectRepository(Client) private readonly clientRepo: Repository<Client>,
    @InjectRepository(Contrat) private readonly contratRepo: Repository<Contrat>,
  ) {}

  async create(dto: CreateOperationDto) {
    let client: Client | null = null;
    // If clientId present, fetch it
    if (dto.clientId) {
      client = await this.clientRepo.findOne({ where: { id: dto.clientId } });
      if (!client) throw new NotFoundException('Client introuvable');
    } else if (dto.client) {
      // find by email if exists
      client = await this.clientRepo.findOne({
        where: { email: dto.client.email },
      });
      if (!client) {
        // create new client
        const newClient = this.clientRepo.create({
          nom: dto.client.nom,
          prenom: dto.client.prenom,
          email: dto.client.email,
          telephone: dto.client.telephone || '',
        } as Client);
        client = await this.clientRepo.save(newClient);
      }
    } else {
      throw new BadRequestException('ClientId ou client (détails) requis');
    }

    const bien = await this.proprieteRepo.findOne({
      where: { id: dto.proprieteId },
    });

    if (!bien) throw new NotFoundException('Propriété introuvable');

    // CORRECTION : Utilisation de StatutPropriete.DISPONIBLE au lieu de 'disponible'
    if (bien.statut !== StatutPropriete.DISPONIBLE) {
      throw new BadRequestException("Ce bien n'est pas disponible");
    }

    const montant = dto.montantFinal ?? Number(bien.prix ?? 0);

    const nouvelleOperation = this.operationRepo.create({
      type: dto.type,
      montantFinal: montant,
      client: client, // Objet Client complet (récupéré ou créé)
      propriete: bien, // Objet Propriete complet
      statut: StatutOperation.EN_ATTENTE,
    });

    return await this.operationRepo.save(nouvelleOperation);
  }

  // CETTE MÉTHODE MANQUAIT (répare l'erreur image df2f67)
  async findAll() {
    return await this.operationRepo.find({
      relations: ['client', 'propriete', 'contrat'],
    });
  }

  async findForProperty(propertyId: number) {
    return this.operationRepo.find({
      where: { propriete: { id: propertyId } },
      relations: ['client', 'propriete', 'contrat'],
      order: { createdAt: 'DESC' },
    });
  }

  async findForAgent(userId: number, onlyPending = false) {
    const qb = this.operationRepo
      .createQueryBuilder('op')
      .leftJoinAndSelect('op.client', 'client')
      .leftJoinAndSelect('op.propriete', 'propriete')
      .leftJoinAndSelect('op.contrat', 'contrat')
      .leftJoin('propriete.proprietaire', 'owner')
      .leftJoin('owner.user', 'agent')
      .where('agent.id = :userId', { userId })
      .orderBy('op.createdAt', 'DESC');

    if (onlyPending) {
      qb.andWhere('op.statut = :statut', { statut: StatutOperation.EN_ATTENTE });
    }

    return qb.getMany();
  }

  async findForAgentByClient(userId: number, clientId: number) {
    const qb = this.operationRepo
      .createQueryBuilder('op')
      .leftJoinAndSelect('op.client', 'client')
      .leftJoinAndSelect('op.propriete', 'propriete')
      .leftJoinAndSelect('op.contrat', 'contrat')
      .leftJoin('propriete.proprietaire', 'owner')
      .leftJoin('owner.user', 'agent')
      .where('agent.id = :userId', { userId })
      .andWhere('client.id = :clientId', { clientId })
      .orderBy('op.createdAt', 'DESC');

    return qb.getMany();
  }

  async confirmerOperation(id: number, dto: ConfirmOperationDto, userId?: number) {
    const operation = await this.operationRepo.findOne({
      where: { id },
      relations: ['client', 'propriete', 'contrat'],
    });
    if (!operation) throw new NotFoundException('Opération introuvable');

    const bien = await this.proprieteRepo.findOne({
      where: { id: operation.propriete.id },
      relations: ['proprietaire', 'proprietaire.user'],
    });
    if (!bien) throw new NotFoundException('Propriété introuvable');

    // Vérifier que l'utilisateur authentifié est le propriétaire du bien
    if (userId && (!bien.proprietaire || !bien.proprietaire.user || bien.proprietaire.user.id !== userId)) {
      throw new ForbiddenException('Accès refusé : vous devez être le propriétaire pour confirmer cette opération.');
    }

    // Déterminer le type final (vente/location) pour mettre à jour le bien
    const finalType = dto.typeOperation ?? operation.type;
    if (![TypeOperation.VENTE, TypeOperation.LOCATION].includes(finalType)) {
      throw new BadRequestException('typeOperation doit être "vente" ou "location"');
    }

    // Mettre à jour l'opération
    operation.type = finalType;
    operation.statut = StatutOperation.TERMINE;
    if (dto.montantFinal !== undefined) {
      operation.montantFinal = dto.montantFinal;
    }

    // Mettre à jour le statut du bien
    bien.statut =
      finalType === TypeOperation.VENTE
        ? StatutPropriete.VENDU
        : StatutPropriete.LOUE;

    // Créer ou mettre à jour le contrat lié
    let contrat = operation.contrat;
    if (!contrat) {
      contrat = this.contratRepo.create({
        client: operation.client,
        operation,
        dateDebut: new Date(),
        montant: operation.montantFinal ?? 0,
        statut: StatutContrat.ACTIF,
      });
    } else {
      contrat.statut = StatutContrat.ACTIF;
      contrat.dateFin = null;
      contrat.montant = operation.montantFinal ?? contrat.montant;
    }

    await this.proprieteRepo.save(bien);
    await this.operationRepo.save(operation);
    await this.contratRepo.save(contrat);

    return {
      operation,
      propriete: bien,
      contrat,
    };
  }
}
