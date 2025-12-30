import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { Propriete } from '../../properties/entities/propriete.entity';

@Entity()
@Index(['email'])
@Index(['nom', 'prenom'])
export class Proprietaire {
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

  @OneToMany(() => Propriete, (propriete) => propriete.proprietaire)
  proprietes: Propriete[];
}
