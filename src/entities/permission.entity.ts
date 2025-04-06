import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ unique: true })
  slug: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = this.name
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '_') // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ''); // Remove non-word characters (except hyphen)
  }
}
