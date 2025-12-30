import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Proprietaire } from './entities/proprietaire.entity';
import { AuthModule } from './auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Client, Proprietaire])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule], // Permet à d'autres modules d'utiliser ces entités
})
export class UsersModule {}
