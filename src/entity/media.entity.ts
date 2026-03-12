import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  page_id: number;

  @Column()
  section_id: number;

  @Column()
  media_title: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  text: string;
}