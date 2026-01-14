import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Propriete } from '../../properties/entities/propriete.entity';
import { User } from '../../../auth/user.entity';
import { Notification } from '../../notifications/notification.entity';

@Entity()
export class Proprietaire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  telephone: string;

  @Column({ nullable: true })
  adresse: string;

  @OneToOne(() => User, (user) => user.proprietaire)
  @JoinColumn()
  user: User;

  @OneToMany(() => Propriete, (p) => p.proprietaire)
  proprietes: Propriete[];

  @OneToMany(() => Notification, (n) => n.proprietaire)
  notifications: Notification[];
}
