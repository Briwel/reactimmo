import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../modules/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateProprietaireDto } from '../modules/users/dto/create-proprietaire.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  // 1. INSCRIPTION : Crée un User + un profil Propriétaire lié
  async register(dto: CreateProprietaireDto) {
    // Vérifier si l'email existe déjà dans la table User
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Étape A : Créer l'entrée dans la table 'User' (Authentification)
    const user = await this.userRepo.save(
      this.userRepo.create({
        email: dto.email,
        password: hashedPassword,
        // On peut ajouter le nom ici si votre entité User a un champ 'name'
      }),
    );

    // Étape B : Créer le profil 'Proprietaire' lié (Informations métiers)
    // On passe le DTO et l'objet User complet pour établir la relation OneToOne
    await this.usersService.createOwner(dto, user);

    // On connecte automatiquement l'utilisateur après l'inscription
    return this.login(user);
  }

  // 2. VALIDATION : Vérifie les identifiants lors du Login
  async validateUser(email: string, pass: string) {
    // On cherche l'utilisateur via le service qui inclut la relation 'proprietaire'
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      // On retire le password de l'objet retourné par sécurité
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _unused, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Identifiants incorrects');
  }

  // 3. LOGIN : Génère le JWT Token
  login(user: {
    id: number;
    email: string;
    proprietaire?: { nom?: string; prenom?: string } | null;
  }) {
    // Le payload contient l'ID unique (sub) et l'email
    const payload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        // On renvoie aussi les infos du profil pour le frontend
        nom: user.proprietaire?.nom,
        prenom: user.proprietaire?.prenom,
      },
    };
  }

  // 4. RÉCUPÉRATION DU PROFIL (Utilisé par AuthController)
  async getProfile(userId: number) {
    return this.userRepo.findOne({
      where: { id: userId },
      relations: ['proprietaire'],
    });
  }
}
