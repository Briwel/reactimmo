import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { Contrat } from '../../operations/entities/contrat.entity';
import { Operations } from '../../operations/entities/operations.entity';
import { Propriete } from '../../properties/entities/propriete.entity';

@Entity()
@Index(['email']) // Index trouvé dans ta base
@Index(['nom', 'prenom']) // Index trouvé dans ta base
export class Client {
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
  password?: string;

  @OneToMany(() => Contrat, (contrat) => contrat.client)
  contrats: Contrat[];

  @OneToMany(() => Operations, (operation) => operation.client)
  operations: Operations[];

  // CORRECTION : Une seule déclaration propre
  @OneToMany(() => Propriete, (propriete) => propriete.client)
  proprietes: Propriete[];
}
