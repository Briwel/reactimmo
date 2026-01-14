import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operations } from './entities/operations.entity';
import { Contrat } from './entities/contrat.entity';
import { Propriete } from '../properties/entities/propriete.entity';
import { Client } from '../users/entities/client.entity';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Operations, Contrat, Propriete, Client])],
  exports: [TypeOrmModule],
  providers: [OperationsService],
  controllers: [OperationsController],
})
export class OperationsModule {}
