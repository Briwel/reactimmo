import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateProprietaireDto } from '../modules/users/dto/create-proprietaire.dto';
import { LoginDto } from '../modules/users/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: CreateProprietaireDto) {
    return this.authService.register(userData);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // 1. On vérifie d'abord si l'utilisateur existe et si le mot de passe est bon
    // Cette méthode renvoie un objet 'Proprietaire' (sans le password) ou lève une erreur
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    // 2. Maintenant qu'on a un vrai "user", on peut générer le token JWT
    return this.authService.login(user);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request) {
    // Passport injecte l'entité Proprietaire dans req.user via JwtStrategy
    const raw = req.user as unknown;
    if (!raw || typeof raw !== 'object') return null;

    // Extraire uniquement les champs sûrs et les typer explicitement
    const record = raw as Record<string, unknown>;
    const id =
      typeof record.id === 'number'
        ? record.id
        : typeof record.id === 'string'
          ? Number(record.id)
          : undefined;
    const nom = typeof record.nom === 'string' ? record.nom : undefined;
    const prenom =
      typeof record.prenom === 'string' ? record.prenom : undefined;
    const email = typeof record.email === 'string' ? record.email : undefined;
    const telephone =
      typeof record.telephone === 'string' ? record.telephone : undefined;
    const photo = typeof record.photo === 'string' ? record.photo : undefined;

    return { id, nom, prenom, email, telephone, photo };
  }
}
