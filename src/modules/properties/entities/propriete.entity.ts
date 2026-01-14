import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Proprietaire } from '../../users/entities/proprietaire.entity';
import { Photo } from './photo.entity';
import { Operations } from '../../operations/entities/operations.entity';

export enum StatutPropriete {
  DISPONIBLE = 'Disponible',
  LOUE = 'Loué',
  VENDU = 'Vendu',
}

@Entity()
export class Propriete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column()
  adresse: string;

  @Column()
  type: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value?: number) => (value === undefined ? null : value),
      from: (value: string | null) => (value === null ? null : Number(value)),
    },
  })
  prix: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value?: number | null) => (value === undefined ? null : value),
      from: (value: string | null) => (value === null ? null : Number(value)),
    },
  })
  superficie: number | null;

  @Column('int')
  nombrePieces: number;

  @Column({ type: 'text', nullable: true })
  contratClauses: string | null;

  @Column({
    type: 'text',
    enum: StatutPropriete,
    default: StatutPropriete.DISPONIBLE,
  })
  statut: StatutPropriete;

  @ManyToOne(() => Proprietaire, (p) => p.proprietes)
  proprietaire: Proprietaire;

  @OneToMany(() => Photo, (photo) => photo.propriete)
  photos: Photo[];

  @OneToMany(() => Operations, (op) => op.propriete)
  operations: Operations[];
}
