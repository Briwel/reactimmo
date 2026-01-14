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
  Put,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { AuthService } from '../../auth/auth.service';
import { CreateProprietaireDto } from './dto/create-proprietaire.dto';
import { LoginDto } from './dto/login.dto';
import { Proprietaire } from './entities/proprietaire.entity';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // --- 1. UPLOAD PHYSIQUE DE LA PHOTO ---
  // Cette route enregistre le fichier dans le dossier /uploads et retourne son nom
  @UseGuards(AuthGuard('jwt'))
  @Post('upload-photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Chemin relatif à la racine du projet
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `avatar-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Seules les images sont autorisées'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Fichier manquant ou format invalide');
    }
    // On retourne le nom du fichier. Le Front-end devra envoyer ce nom à 'update'
    return { filename: file.filename };
  }

  // --- 2. MISE À JOUR DU PROFIL (Lier le nom de la photo à l'utilisateur) ---
  @UseGuards(AuthGuard('jwt'))
  @Put('update')
  async updateProfile(
    @Req() req: any,
    @Body() updateData: Partial<Proprietaire>,
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    try {
      // Si updateData contient 'photo', UsersService mettra à jour la colonne en base
      const updated = await this.usersService.update(userId, updateData);
      return { success: true, user: updated };
    } catch (error) {
      throw error;
    }
  }

  // --- 3. AUTHENTIFICATION ---

  @Post('register')
  async register(@Body() createProprietaireDto: CreateProprietaireDto) {
    return this.authService.register(createProprietaireDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
    return this.authService.login(user);
  }

  // --- 4. RÉCUPÉRATION DES DONNÉES ---

  @Get('all')
  async getAll() {
    return this.usersService.findAll();
  }

  @Delete('delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  // --- CLIENTS ---
  @Post('clients')
  async createClient(@Body() dto: any) {
    // validation is handled by DTO in service (DB constraints)
    return this.usersService.createClient(dto);
  }

  @Get('clients')
  async getClients() {
    return this.usersService.findAllClients();
  }

  @Get('clients/:id')
  async getClient(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findClientById(id);
  }

  // --- 5. ROUTES GOOGLE (À implémenter plus tard) ---

  @Get('google')
  googleAuth() {
    throw new BadRequestException('Google login non implémenté');
  }

  @Get('google/callback')
  googleAuthRedirect() {
    throw new BadRequestException('Google callback non implémenté');
  }
}
