import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { Proprietaire } from '../../users/entities/proprietaire.entity';
import { Photo } from './photo.entity';
import { Operations } from '../../operations/entities/operations.entity';
import { Client } from '../../users/entities/client.entity';

// 1. DÉFINITION DES CHOIX (ENUM)
export enum StatutPropriete {
  DISPONIBLE = 'Disponible',
  VENDU = 'Vendu',
  LOUE = 'Loué',
  RESERVE = 'Réservé',
}

export enum TypePropriete {
  APPARTEMENT = 'appartement',
  MAISON = 'maison',
  VILLA = 'villa',
  STUDIO = 'studio',
  COMMERCIAL = 'commercial',
}

@Entity()
@Index(['statut']) // Index présent dans ta base
@Index(['type']) // Index présent dans ta base
export class Propriete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'text',
    default: TypePropriete.APPARTEMENT,
  })
  type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  prix: number;

  // 2. UTILISATION DE L'ENUM POUR LE STATUT
  @Column({
    type: 'text',
    default: StatutPropriete.DISPONIBLE,
  })
  statut: StatutPropriete; //

  @Column({ type: 'text', nullable: true })
  adresse: string;

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  superficie: number;

  @Column('int', { nullable: true })
  nombrePieces: number;

  // RELATION VERS LE PROPRIÉTAIRE (Table : proprietaire)
  @ManyToOne(() => Proprietaire, (p) => p.proprietes, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  proprietaire: Proprietaire; //

  // RELATION VERS LE CLIENT (Table : client)
  @ManyToOne(() => Client, (c) => c.proprietes, {
    nullable: true,
  })
  client: Client;

  // RELATION VERS LES PHOTOS
  @OneToMany(() => Photo, (photo) => photo.propriete, {
    cascade: true,
  })
  photos: Photo[];

  // RELATION VERS LES OPÉRATIONS
  @OneToMany(() => Operations, (operation) => operation.propriete)
  operations: Operations[];
}
