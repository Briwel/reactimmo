import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Importation des modules métier
import { UsersModule } from './modules/users/users.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { OperationsModule } from './modules/operations/operations.module';
import { OperationsService } from './modules/operations/operations.service';
import { OperationsController } from './modules/operations/operations.controller';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db_immobilier.sqlite',
      // On importe explicitement les classes pour être sûr que TypeORM les voit au démarrage
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      autoLoadEntities: true,
      synchronize: true, // Très important pour SQLite en développement
      logging: true,
    }),
    AuthModule,
    UsersModule,
    PropertiesModule,
    OperationsModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '/backend/uploads'), // Chemin vers ton dossier d'images
      serveRoot: '/backend/uploads', // URL de base pour accéder aux images
    }),

    AuthModule,
  ],
  providers: [
    // Activation globale du ThrottlerGuard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    OperationsService,
  ],
  controllers: [OperationsController],
})
export class AppModule {}
