import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';

import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from 'src/dto/create-gallery.dto';
import { UpdateGalleryDto } from 'src/dto/update-gallery.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('gallery')
@Controller('gallery')
export class GalleryController {

  constructor(private service: GalleryService) { }

  @Get()
  @ApiQuery({ name: 'section_id' })
  find(@Query('section_id') section_id: number) {
    return this.service.find(section_id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        page_id: { type: 'number' },
        section_id: { type: 'number' },
        category: { type: 'string' },
        title: { type: 'string' },
        span: { type: 'string' },
        sort_order: { type: 'number' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateGalleryDto
  ) {
    return this.service.create(file, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  update(@Param('id') id: number, @Body() dto: UpdateGalleryDto) {
    return this.service.update(id, dto);
  }

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
  replace(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.service.replace(id, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
}