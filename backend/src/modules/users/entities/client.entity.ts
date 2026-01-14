import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Operations } from '../../operations/entities/operations.entity';
import { Contrat } from '../../operations/entities/contrat.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  telephone: string;

  @OneToMany(() => Contrat, (contrat) => contrat.client)
  contrats: Contrat[];

  @OneToMany(() => Operations, (op) => op.client)
  operations: Operations[];
}
