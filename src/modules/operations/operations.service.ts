import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operations, TypeOperation } from './entities/operations.entity';
import {
  Propriete,
  StatutPropriete,
} from '../properties/entities/propriete.entity';
import { Client } from '../users/entities/client.entity';
import { CreateOperationDto } from './dto/create-operation.dto';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operations)
    private readonly operationRepo: Repository<Operations>,
    @InjectRepository(Propriete)
    private readonly proprieteRepo: Repository<Propriete>,
    @InjectRepository(Client) private readonly clientRepo: Repository<Client>,
  ) {}

  async create(dto: CreateOperationDto) {
    const client = await this.clientRepo.findOne({
      where: { id: dto.clientId },
    });
    const bien = await this.proprieteRepo.findOne({
      where: { id: dto.proprieteId },
    });

    if (!client) throw new NotFoundException('Client introuvable');
    if (!bien) throw new NotFoundException('Propriété introuvable');

    // CORRECTION : Utilisation de StatutPropriete.DISPONIBLE au lieu de 'disponible'
    if (bien.statut !== StatutPropriete.DISPONIBLE) {
      throw new BadRequestException("Ce bien n'est pas disponible");
    }

    const nouvelleOperation = this.operationRepo.create({
      type: dto.type,
      montantFinal: dto.montantFinal,
      client: client, // Objet Client complet (récupéré via findOne)
      propriete: bien, // Objet Propriete complet
    });

    // CORRECTION : Utilisation des Enums pour la mise à jour (image de5d91)
    bien.statut =
      dto.type === TypeOperation.VENTE
        ? StatutPropriete.VENDU
        : StatutPropriete.LOUE;

    await this.proprieteRepo.save(bien);
    return await this.operationRepo.save(nouvelleOperation);
  }

  // CETTE MÉTHODE MANQUAIT (répare l'erreur image df2f67)
  async findAll() {
    return await this.operationRepo.find({
      relations: ['client', 'propriete'],
    });
  }
}
