import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import cloudinary from "./cloudinary.provider"
import { Readable } from 'stream';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('upload')
@Controller('upload')
export class UploadController {
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {

    return new Promise((resolve, reject) => {

      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio',
          resource_type: 'auto'
        },
        (error, result) => {

          if (error) return reject(error);

          resolve({
            url: result!.secure_url,
            public_id: result!.public_id,
            resource_type: result!.resource_type
          });

        },
      );

      upload.end(file.buffer);

    });

  }

}