import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    Patch,
    Query,
    InternalServerErrorException,
    UseGuards 
} from '@nestjs/common';
import { MediaService } from 'src/media/media.service';
import { CreateMediaDto } from 'src/dto/create-media.dto';
import { UpdateMediaDto } from 'src/dto/update-media.dto';
import { ApiQuery, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('media')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('media')
export class MediaController {
    constructor(private service: MediaService) { }
@Post()
  async create(@Body() dto: CreateMediaDto) {
    try {
      return await this.service.create(dto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create media');
    }
  }

  @Get()
  @ApiQuery({ name: 'page_id', required: false })
  @ApiQuery({ name: 'section_id', required: false })
  @ApiQuery({ name: 'media_title', required: false })
  async findAll(
    @Query('page_id') page_id?: number,
    @Query('section_id') section_id?: number,
    @Query('media_title') media_title?: string,
  ) {
    try {
      return await this.service.findAll(page_id, section_id, media_title);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch media');
    }
  }

  @Get('section/:id')
  async findBySection(@Param('id') id: number) {
    try {
      return await this.service.findBySection(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch section media');
    }
  }

  @Patch(':id')
  async patch(@Param('id') id: number, @Body() dto: UpdateMediaDto) {
    try {
      return await this.service.update(id, dto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update media');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      return await this.service.delete(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete media');
    }
  }
    // @Put(':id')
    // update(@Param('id') id: number, @Body() dto: CreateMediaDto) {
    //     return this.service.update(id, dto);
    // }
}
