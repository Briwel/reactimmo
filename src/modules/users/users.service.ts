import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Client) private clientRepo: Repository<Client>,
  ) {}

  // 1. CRÉATION (Utilisé pour l'inscription)
  async create(data: CreateClientDto) {
    // On vérifie si l'email existe déjà avant de créer
    const existing = await this.clientRepo.findOne({
      where: { email: data.email },
    });
    if (existing) {
      throw new BadRequestException('Cet email est déjà enregistré.');
    }

    const newClient = this.clientRepo.create(data);
    return await this.clientRepo.save(newClient);
  }

  // 2. RECHERCHE PAR EMAIL (Très utile pour l'Auth plus tard)
  async findByEmail(email: string): Promise<Client | null> {
    return await this.clientRepo.findOne({ where: { email } });
  }
  // 3. RECHERCHE PAR ID
  async findOne(id: number) {
    const client = await this.clientRepo.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas`);
    }
    return client;
  }

  // 4. RÉCUPÉRATION DE TOUS LES UTILISATEURS
  async findAll() {
    return await this.clientRepo.find({
      order: { id: 'DESC' }, // Les plus récents en premier
    });
  }

  // 5. SUPPRESSION
  async remove(id: number) {
    const client = await this.findOne(id);
    return await this.clientRepo.remove(client);
  }
}
