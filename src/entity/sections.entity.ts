import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  page_id: number;

  @Column()
  title: string;
}