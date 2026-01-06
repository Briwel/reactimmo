import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Proprietaire } from '../modules/users/entities/proprietaire.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Ce sera le mot de passe haché

  @OneToMany(() => Proprietaire, (proprietaire) => proprietaire.user)
  proprietes: Proprietaire[];
}
