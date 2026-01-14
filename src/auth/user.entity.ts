import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Proprietaire } from '../modules/users/entities/proprietaire.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'proprietaire' })
  role: string;

  @OneToOne(() => Proprietaire, (p) => p.user)
  proprietaire: Proprietaire;
}
