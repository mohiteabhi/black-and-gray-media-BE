import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from 'src/entity/media.entity';
import { CreateMediaDto } from 'src/dto/create-media.dto';

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

      await this.repo.update(id, dto);

      return this.repo.findOne({
        where: { id },
      });

    } catch (error) {
      throw error;
    }

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
