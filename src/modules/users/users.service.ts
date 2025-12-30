import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Client) private clientRepo: Repository<Client>,
    private jwtService: JwtService,
  ) {}

  // 1. AUTHENTIFICATION GOOGLE
  async googleLogin(reqUser: {
    email: string;
    lastName?: string;
    firstName?: string;
    phoneNumber?: string;
  }) {
    if (!reqUser) {
      throw new UnauthorizedException('Aucun utilisateur trouvé via Google');
    }

    // On cherche si l'utilisateur existe déjà par son email
    let user = await this.clientRepo.findOne({
      where: { email: reqUser.email },
    });

    // S'il n'existe pas, on le crée automatiquement
    if (!user) {
      user = this.clientRepo.create({
        email: reqUser.email,
        nom: reqUser.lastName || 'GoogleUser',
        prenom: reqUser.firstName || '',
        telephone: reqUser.phoneNumber || '00000000', // Valeur par défaut
        // Le mot de passe reste undefined car c'est une connexion Google
      });
      await this.clientRepo.save(user);
    }

    // On génère le token JWT de ton application
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
      },
    };
  }

  // 2. INSCRIPTION CLASSIQUE
  async register(data: CreateClientDto) {
    const { password, ...rest } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = this.clientRepo.create({
      ...rest,
      password: hashedPassword,
    });

    return this.clientRepo.save(newClient);
  }

  // 3. CONNEXION CLASSIQUE
  async login(email: string, pass: string) {
    const client = await this.clientRepo.findOne({ where: { email } });
    // Vérification : l'utilisateur doit avoir un password (cas des comptes classiques)
    if (
      client &&
      client.password &&
      (await bcrypt.compare(pass, client.password))
    ) {
      const payload = { sub: client.id, email: client.email };
      return { access_token: this.jwtService.sign(payload) };
    }
    throw new UnauthorizedException('Identifiants invalides');
  }

  // 4. RÉCUPÉRATION
  async findAll() {
    return await this.clientRepo.find();
  }

  // 5. SUPPRESSION
  async remove(id: number) {
    const client = await this.clientRepo.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas`);
    }
    return await this.clientRepo.remove(client);
  }
}
