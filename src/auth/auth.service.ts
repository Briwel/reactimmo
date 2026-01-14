import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../modules/users/users.service';
import { CreateClientDto } from '../modules/users/dto/create-client.dto';
import { Client } from '../modules/users/entities/client.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 1. INSCRIPTION (Fix: Property 'register' does not exist)
  async register(createClientDto: CreateClientDto) {
    const { password, email, ...rest } = createClientDto;

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.create({
      ...rest,
      email,
      password: hashedPassword,
    });

    return this.login(newUser);
  }

  // 2. CONNEXION (Fix: Utilisation de UnauthorizedException)
  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<Client, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }
    // Ici on utilise enfin l'exception importée
    throw new UnauthorizedException('Identifiants incorrects');
  }

  // 3. GÉNÉRATION DU TOKEN
  login(user: Client) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
      },
    };
  }
}
