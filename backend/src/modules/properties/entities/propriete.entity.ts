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

// Définition des types autorisés
export enum TypePropriete {
  APPARTEMENT = 'appartement',
  MAISON = 'maison',
  VILLA = 'villa',
  STUDIO = 'studio',
  COMMERCIAL = 'commercial',
}

// Définition des statuts autorisés
export enum StatutPropriete {
  DISPONIBLE = 'Disponible',
  VENDU = 'Vendu',
  LOUE = 'Loué',
  RESERVE = 'Réservé',
}

@Entity()
@Index(['statut'])
@Index(['type'])
@Index(['proprietaire'])
export class Propriete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' }) // AJOUTÉ : Titre du bien
  titre: string;

  @Column({ type: 'text', nullable: true }) // AJOUTÉ : Description détaillée
  description: string;

  @Column({
    type: 'text',
    default: TypePropriete.APPARTEMENT,
  })
  type: TypePropriete;

  @Column('decimal', { precision: 10, scale: 2 })
  prix: number;

  @Column({
    type: 'text',
    default: StatutPropriete.DISPONIBLE,
  })
  statut: StatutPropriete;

  @Column({ type: 'text', nullable: true })
  adresse: string;

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  superficie: number;

  @Column('int', { nullable: true })
  nombrePieces: number;

  // Relation vers le module Users
  @ManyToOne(() => Proprietaire, (p) => p.proprietes, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  proprietaire: Proprietaire;

  // Relation vers les photos
  @OneToMany(() => Photo, (photo) => photo.propriete, {
    cascade: true,
  })
  photos: Photo[];

  // Relation vers les opérations
  @OneToMany(() => Operations, (operation) => operation.propriete)
  operations: Operations[];
}
