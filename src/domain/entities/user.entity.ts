import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { Gender, Nullable } from '../../common/constant';
import { Mining } from './mining.entity';

@Entity()
export class User extends BaseEntity {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', length: 320 })
  email!: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  name!: Nullable<string>;

  @Column({ type: 'varchar', length: 320, nullable: true })
  @Exclude()
  password?: string;

  @Column({ type: 'boolean', default: false })
  isRegisteredWithGoogle!: boolean;

  @Column({ type: 'varchar', length: 64 })
  phone?: string;

  @Column({ type: 'varchar', length: 200 })
  avatar?: string;

  @Column({ type: 'varchar', length: 64 })
  wallet?: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  refererCode!: string;

  @Column({ type: 'varchar', length: 64 })
  referBy?: string;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  point!: number;

  @Column({ type: 'int', default: 0 })
  exp!: number;

  @Column({ type: 'int', default: 1 })
  level!: number;

  @Column({ type: 'enum', enum: Gender })
  gender?: Nullable<Gender>;

  @Column({ type: 'int', default: 0 })
  boost!: number;

  @Column({ type: 'int' })
  old?: number;

  @Column('decimal', { precision: 5, scale: 2 })
  height?: number;

  @Column('decimal', { precision: 4, scale: 2 })
  weight?: number;

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean;

  @OneToMany(() => Mining, (mining) => mining.user)
  minings!: Mining[];
}
