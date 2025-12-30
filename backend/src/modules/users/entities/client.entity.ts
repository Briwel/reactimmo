import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { Contrat } from '../../operations/entities/contrat.entity';
import { Operations } from 'src/modules/operations/entities/operations.entity';

@Entity()
@Index(['email'])
@Index(['nom', 'prenom'])
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  nom: string;

  @Column({ type: 'text' })
  prenom: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  telephone: string;

  @Column({ type: 'text', nullable: true })
  adresse: string;

  @Column({ type: 'text', nullable: true })
  password?: string; // Sera haché avec bcrypt

  @OneToMany(() => Contrat, (contrat) => contrat.client)
  contrats: Contrat[];

  @OneToMany(() => Operations, (operation) => operation.client)
  operations: Operations[];
}
