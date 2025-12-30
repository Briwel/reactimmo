import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Client } from '../../users/entities/client.entity';
import { Operations } from './operations.entity';

export enum StatutContrat {
  ACTIF = 'actif',
  RESILIE = 'resilie',
  EXPIRE = 'expire',
}

@Entity()
@Index(['statut'])
@Index(['client'])
@Index(['dateDebut'])
@Index(['dateFin'])
export class Contrat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  dateDebut: Date;

  @Column({ type: 'date', nullable: true })
  dateFin: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  montant: number;

  @Column({
    type: 'text',
    default: StatutContrat.ACTIF,
  })
  statut: StatutContrat;

  @ManyToOne(() => Client, (client) => client.contrats, {
    onDelete: 'CASCADE',
  })
  client: Client;

  @OneToOne(() => Operations, (operation) => operation.contrat, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  operation: Operations;
}
