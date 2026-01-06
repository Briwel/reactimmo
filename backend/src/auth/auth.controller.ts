import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateClientDto } from '../modules/users/dto/create-client.dto';
import { LoginDto } from 'src/modules/users/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: CreateClientDto) {
    return this.authService.register(userData);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // 1. On vérifie d'abord si l'utilisateur existe et si le mot de passe est bon
    // Cette méthode renvoie un objet 'Client' (sans le password) ou lève une erreur
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    // 2. Maintenant qu'on a un vrai "user", on peut générer le token JWT
    return this.authService.login(user as any);
  }
}
