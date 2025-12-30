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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateClientDto } from './dto/create-client.dto';
import { LoginDto } from './dto/login.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // --- NOUVELLES ROUTES GOOGLE ---

  @Get('google')
  @UseGuards(AuthGuard('google'))
  // Cette route redirige l'utilisateur vers la page de connexion Google
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  // Google renvoie l'utilisateur ici après la connexion
  async googleAuthRedirect(
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
      throw new Error('Aucun utilisateur trouvé');
    }
    return this.usersService.googleLogin(req.user);
  }

  // --- ROUTES EXISTANTES ---

  @Post('register')
  async register(@Body() createClientDto: CreateClientDto) {
    return this.usersService.register(createClientDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto.email, loginDto.password);
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
