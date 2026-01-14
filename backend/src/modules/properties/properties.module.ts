import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Propriete } from './entities/propriete.entity'; // Vérifie bien le nom du fichier
import { Photo } from './entities/photo.entity';
import { PropertiesGateway } from './properties.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  // Cette ligne est INDISPENSABLE pour corriger l'erreur du terminal
  imports: [
    TypeOrmModule.forFeature([Propriete, Photo]),
    JwtModule.register({
      secret: 'SECRET_KEY',
    }),
    UsersModule,
    NotificationsModule,
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertiesGateway],
  exports: [PropertiesService],
})
export class PropertiesModule {}
