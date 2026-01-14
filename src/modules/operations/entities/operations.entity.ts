import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Client } from '../../users/entities/client.entity';
import { Propriete } from '../../properties/entities/propriete.entity';
import { Contrat } from './contrat.entity';

export enum TypeOperation {
  VENTE = 'vente',
  LOCATION = 'location',
}

@Entity()
export class Operations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-enum', enum: TypeOperation })
  type: TypeOperation;

  @Column('float')
  montantFinal: number;

  // IL EST CRUCIAL D'AJOUTER CES DÉCORATEURS @ManyToOne
  @ManyToOne(() => Client, (client) => client.operations, { nullable: false })
  client: Client;

  @ManyToOne(() => Propriete, (propriete) => propriete.operations, {
    nullable: false,
  })
  propriete: Propriete;

  @OneToOne(() => Contrat, (contrat) => contrat.operation)
  contrat: Contrat;
}
