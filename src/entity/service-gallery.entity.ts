import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('service_gallery')
export class ServiceGallery {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  page_id: number;

  @Column({ nullable: true })
  section_id: number;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  title: string;

  @Column({ default: 'normal' })
  span: string;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({ nullable: true })
  public_id: string;

  @Column({ nullable: true })
  resource_type: string;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}