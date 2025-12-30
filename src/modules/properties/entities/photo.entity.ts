import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Propriete } from './propriete.entity';

@Entity()
@Index(['propriete'])
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Propriete, (propriete) => propriete.photos, {
    onDelete: 'CASCADE',
  })
  propriete: Propriete;
}
