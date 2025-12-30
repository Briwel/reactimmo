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
      database: process.env.DATABASE_PATH || 'db_immobilier.sqlite',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),

    UsersModule,
    PropertiesModule,
    OperationsModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'), // Chemin vers ton dossier d'images
      serveRoot: '/uploads', // URL de base pour accéder aux images
    }),
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
