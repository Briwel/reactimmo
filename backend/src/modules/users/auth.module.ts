import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Proprietaire } from './entities/proprietaire.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Proprietaire]),
    PassportModule,
    JwtModule.register({
      secret: 'CLE_SECRETE_TRES_LONGUE_ET_SECURISEE', // Change ceci plus tard
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UsersService],
  exports: [UsersService, JwtModule], // Exportation pour que l'erreur disparaisse
})
export class AuthModule {}
