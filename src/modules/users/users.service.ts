import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProprietaireDto } from './dto/create-proprietaire.dto';
import { Proprietaire } from './entities/proprietaire.entity';
import { User } from '../../auth/user.entity';
import { Client } from './entities/client.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Proprietaire)
    private readonly ownerRepo: Repository<Proprietaire>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
  ) {}

  // --- CLIENTS MANAGEMENT ---
  async createClient(dto: Partial<Client>) {
    // if email exists, throw
    const exists = await this.clientRepo.findOne({
      where: { email: dto.email },
    });
    if (exists)
      throw new BadRequestException('Un client avec cet email existe déjà');
    const c = this.clientRepo.create(dto as Client);
    return await this.clientRepo.save(c);
  }

  async findAllClients() {
    return await this.clientRepo.find({ order: { id: 'DESC' } });
  }

  async findClientById(id: number) {
    const c = await this.clientRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Client introuvable');
    return c;
  }

  // 1. RECHERCHE PAR EMAIL (Utilisé par l'AuthService pour le Login et Register)
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { email },
      relations: ['proprietaire'], // On récupère le profil lié s'il existe
    });
  }

  // 2. CRÉATION DU PROFIL PROPRIÉTAIRE (Appelé par AuthService lors du Register)
  async createOwner(
    dto: CreateProprietaireDto,
    user: User,
  ): Promise<Proprietaire> {
    const owner = this.ownerRepo.create({
      nom: dto.nom,
      prenom: dto.prenom,
      telephone: dto.telephone,
      adresse: dto.adresse,
      user: user, // On lie l'entité User créée juste avant
    });
    return await this.ownerRepo.save(owner);
  }

  // 3. RECHERCHE PAR ID (Utilisé pour le profil ou la gestion admin)
  async findOne(id: number): Promise<Proprietaire> {
    const owner = await this.ownerRepo.findOne({
      where: { id },
      relations: ['user', 'proprietes'],
    });
    if (!owner) {
      throw new NotFoundException(
        `Le propriétaire avec l'ID ${id} n'existe pas`,
      );
    }
    return owner;
  }

  // 4. RÉCUPÉRATION DE TOUS LES PROPRIÉTAIRES
  async findAll(): Promise<Proprietaire[]> {
    return await this.ownerRepo.find({
      order: { id: 'DESC' },
      relations: ['user'],
    });
  }

  // 5. SUPPRESSION D'UN COMPTE
  async remove(id: number): Promise<void> {
    const owner = await this.findOne(id);
    // Note: Si vous voulez supprimer aussi le User, il faut gérer le cascade ou le supprimer ici
    await this.ownerRepo.remove(owner);
  }

  // 6. MISE À JOUR DU PROFIL
  async update(
    id: number,
    updateData: Partial<Proprietaire>,
  ): Promise<Proprietaire> {
    try {
      const owner = await this.ownerRepo.preload({
        id: id,
        ...updateData,
      });

      if (!owner) {
        throw new NotFoundException(`Propriétaire #${id} non trouvé`);
      }

      return await this.ownerRepo.save(owner);
    } catch (error) {
      console.error('[UsersService:update] erreur', error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        'Une erreur est survenue lors de la mise à jour du profil',
      );
    }
  }
}
