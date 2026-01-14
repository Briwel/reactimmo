import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ThrottlerModule,
  ThrottlerGuard,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';
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
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 10 }],
    } as ThrottlerModuleOptions),

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
    // Notifications module provides notification endpoints and DB entity
    NotificationsModule,
    ServeStaticModule.forRoot({
      // Serve files from the backend/uploads directory at /uploads
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
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
