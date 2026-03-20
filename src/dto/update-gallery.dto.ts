import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGalleryDto {

  @ApiPropertyOptional()
  category?: string;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  span?: string;

  @ApiPropertyOptional()
  sort_order?: number;
}