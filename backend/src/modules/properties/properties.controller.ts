import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Patch,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  /**
   * ROUTE PRINCIPALE : Création d'un bien avec images
   * Cette route capte les requêtes POST vers /api/properties
   */
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      // 'images' doit correspondre à la clé utilisée dans React
      storage: diskStorage({
        destination: './uploads', // Dossier où les photos seront stockées
        filename: (req, file, cb) => {
          // Génération d'un nom unique : timestamp + nombre aléatoire
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // On extrait les noms des fichiers enregistrés
    const filenames = files?.map((f) => f.filename) || [];
    // On appelle la méthode unifiée du service qui gère texte + photos
    return this.propertiesService.createWithPhotos(
      createPropertyDto,
      filenames,
    );
  }

  @Get()
  async getAll() {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    // Vérifie que findOne existe dans ton service
    return this.propertiesService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    // Vérifie que remove existe dans ton service
    return this.propertiesService.remove(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        /* ... ta config ... */
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePropertyDto: any, // Il recevra les champs texte ici
    @UploadedFiles() files: Express.Multer.File[], // Il recevra les fichiers ici
  ) {
    const filenames = files?.map((f) => f.filename) || [];
    return this.propertiesService.update(id, updatePropertyDto, filenames);
  }
}
