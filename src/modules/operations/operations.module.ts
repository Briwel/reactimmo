import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operations } from './entities/operations.entity';
import { Contrat } from './entities/contrat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operations, Contrat])],
  exports: [TypeOrmModule],
})
export class OperationsModule {}
