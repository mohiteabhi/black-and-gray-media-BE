import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMediaDto {

  @ApiPropertyOptional()
  page_id?: number;

  @ApiPropertyOptional()
  section_id?: number;

  @ApiPropertyOptional()
  media_title?: string;

  @ApiPropertyOptional()
  url?: string;

  @ApiPropertyOptional()
  text?: string;

}