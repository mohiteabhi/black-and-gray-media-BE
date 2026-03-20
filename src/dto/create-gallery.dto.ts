import { ApiProperty } from '@nestjs/swagger';

export class CreateGalleryDto {

  @ApiProperty({ type: Number })
  page_id: number;

  @ApiProperty({ type: Number })
  section_id: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ default: 'normal' })
  span: string;

  @ApiProperty({ required: false })
  sort_order?: number;
}