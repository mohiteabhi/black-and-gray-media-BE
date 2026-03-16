import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaDto {
  @ApiProperty()
  page_id: number;

  @ApiProperty()
  section_id: number;

  @ApiProperty()
  media_title: string;

  @ApiProperty({ required: false })
  url?: string;

  @ApiProperty({ required: false })
  text?: string;

  @ApiProperty({ required: false })
  public_id?: string;
}