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
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { MediaService } from 'src/media/media.service';
import { CreateMediaDto } from 'src/dto/create-media.dto';
import { UpdateMediaDto } from 'src/dto/update-media.dto';
import { ApiQuery, ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('media')
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(private service: MediaService) { }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async patch(@Param('id') id: number, @Body() dto: UpdateMediaDto) {
    try {
      return await this.service.update(id, dto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update media');
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
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

  @Patch(':id/upload')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.service.replaceMediaFile(id, file);
  }

}
