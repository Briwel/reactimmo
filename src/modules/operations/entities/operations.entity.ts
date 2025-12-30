import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  Index,
} from 'typeorm';
import { Propriete } from '../../properties/entities/propriete.entity';
import { Contrat } from './contrat.entity';

export enum TypeOperation {
  VENTE = 'vente',
  LOCATION = 'location',
}

export enum StatutOperation {
  EN_COURS = 'en_cours',
  TERMINE = 'termine',
  ANNULE = 'annule',
}

@Entity()
@Index(['type'])
@Index(['statut'])
@Index(['propriete'])
@Index(['dateOperation'])
export class Operations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    default: TypeOperation.VENTE,
  })
  type: TypeOperation;

  @Column('decimal', { precision: 10, scale: 2 })
  montant: number;

  @Column({ type: 'date' })
  dateOperation: Date;

  @Column({
    type: 'text',
    default: StatutOperation.EN_COURS,
  })
  statut: StatutOperation;

  @ManyToOne(() => Propriete, (propriete) => propriete.operations, {
    onDelete: 'CASCADE',
  })
  propriete: Propriete;

  @OneToOne(() => Contrat, (contrat) => contrat.operation)
  contrat: Contrat;
}
