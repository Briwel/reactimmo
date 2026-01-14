import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../users/entities/client.entity';
import { Propriete } from '../../properties/entities/propriete.entity';
import { Contrat } from './contrat.entity';

// Types d'opérations possibles
export enum TypeOperation {
  VENTE = 'vente',
  LOCATION = 'location',
  RESERVATION = 'reservation',
}

// Statut de l'opération (workflow)
export enum StatutOperation {
  EN_ATTENTE = 'en_attente',
  TERMINE = 'termine',
  ANNULE = 'annule',
}

@Entity()
export class Operations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-enum', enum: TypeOperation })
  type: TypeOperation;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value?: number) => (value === undefined ? null : value),
      from: (value: string | null) => (value === null ? null : Number(value)),
    },
  })
  montantFinal: number;

  @Column({
    type: 'simple-enum',
    enum: StatutOperation,
    default: StatutOperation.EN_ATTENTE,
  })
  statut: StatutOperation;

  @ManyToOne(() => Client, (client) => client.operations, { nullable: false })
  client: Client;

  @ManyToOne(() => Propriete, (propriete) => propriete.operations, {
    nullable: false,
  })
  propriete: Propriete;

  @OneToOne(() => Contrat, (contrat) => contrat.operation)
  contrat: Contrat;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
