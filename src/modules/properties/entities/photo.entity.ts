import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Propriete } from './propriete.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'boolean', default: false })
  isMain: boolean;

  @ManyToOne(() => Propriete, (p) => p.photos, { onDelete: 'CASCADE' })
  propriete: Propriete;
}
