import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { AuthService } from '../../auth/auth.service';
import { CreateClientDto } from './dto/create-client.dto';
import { LoginDto } from './dto/login.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // --- NOUVELLES ROUTES GOOGLE ---

  @Get('google')
  @UseGuards(AuthGuard('google'))
  // Cette route redirige l'utilisateur vers la page de connexion Google
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  // Google renvoie l'utilisateur ici après la connexion
  googleAuthRedirect(
    @Req()
    req: {
      user?: {
        email: string;
        lastName?: string;
        firstName?: string;
        phoneNumber?: string;
      };
    },
  ) {
    // On envoie les infos reçues de Google au service pour créer/connecter le compte
    if (!req.user) {
      throw new UnauthorizedException('Aucun utilisateur trouvé');
    }
    // TODO: Implémenter googleLogin dans AuthService si nécessaire
    throw new UnauthorizedException('Google login non implémenté');
  }

  // --- ROUTES EXISTANTES ---

  @Post('register')
  async register(@Body() createClientDto: CreateClientDto) {
    return this.authService.register(createClientDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      // Récupérer le client complet pour le login
      const client = await this.usersService.findByEmail(loginDto.email);
      if (!client) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
      return this.authService.login(client);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Identifiants incorrects');
    }
  }

  @Get('all')
  async getAll() {
    return this.usersService.findAll();
  }

  @Delete('delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
