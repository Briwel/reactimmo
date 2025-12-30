import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Propriete } from './entities/propriete.entity'; // Vérifie bien le nom du fichier
import { Photo } from './entities/photo.entity';

@Module({
  // Cette ligne est INDISPENSABLE pour corriger l'erreur du terminal
  imports: [TypeOrmModule.forFeature([Propriete, Photo])],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
