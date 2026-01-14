import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Proprietaire } from './entities/proprietaire.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Proprietaire]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService], // Permet à d'autres modules d'utiliser ces entités et le service
})
export class UsersModule {}
