import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from 'src/entity/media.entity';
import { CreateMediaDto } from 'src/dto/create-media.dto';
import cloudinary from 'src/upload/cloudinary.provider';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private repo: Repository<Media>,
  ) { }
  async create(dto: CreateMediaDto) {
    try {
      return await this.repo.save(dto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create media');
    }
  }

  async findAll(page_id?: number, section_id?: number, media_title?: string) {

    try {

      const query: any = {};

      if (page_id) {
        query.page_id = page_id;
      }

      if (section_id) {
        query.section_id = section_id;
      }

      if (media_title) {
        query.media_title = media_title;
      }

      return await this.repo.find({
        where: query,
      });

    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch media');
    }
  }

  async findBySection(sectionId: number) {
    try {

      const media = await this.repo.find({
        where: { section_id: sectionId },
      });

      if (!media.length) {
        throw new NotFoundException('No media found for this section');
      }

      return media;

    } catch (error) {
      throw error;
    }
  }

  async update(id: number, dto: Partial<CreateMediaDto>) {

    try {

      const media = await this.repo.findOne({
        where: { id },
      });

      if (!media) {
        throw new NotFoundException(`Media with id ${id} not found`);
      }
      if (dto.public_id && media.public_id && media.public_id !== dto.public_id) {

        await cloudinary.uploader.destroy(media.public_id, {
          resource_type: media.resource_type || 'image'
        });

      }

      await this.repo.update(id, dto);

      return this.repo.findOne({
        where: { id },
      });

    } catch (error) {
      throw error;
    }
  }

  async replaceMediaFile(id: number, file: Express.Multer.File) {

  const media = await this.repo.findOne({
    where: { id }
  });

  if (!media) {
    throw new NotFoundException(`Media with id ${id} not found`);
  }

  // 1️⃣ Delete old asset
  if (media.public_id) {

    await cloudinary.uploader.destroy(media.public_id, {
      resource_type: media.resource_type || 'image'
    });

  }

  // 2️⃣ Upload new asset
  const uploadResult: any = await new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'portfolio',
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(file.buffer);

  });

  // 3️⃣ Update DB
  await this.repo.update(id, {
    url: uploadResult.secure_url,
    public_id: uploadResult.public_id,
    resource_type: uploadResult.resource_type
  });

  return this.repo.findOne({
    where: { id }
  });

}

  async delete(id: number) {

    try {

      const media = await this.repo.findOne({
        where: { id },
      });

      if (!media) {
        throw new NotFoundException(`Media with id ${id} not found`);
      }

      await this.repo.delete(id);

      return {
        message: 'Media deleted successfully',
      };

    } catch (error) {
      throw error;
    }

  }
}
