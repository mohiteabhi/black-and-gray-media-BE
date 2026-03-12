import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: true })
  is_active: boolean;
}