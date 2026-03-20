import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceGallery } from 'src/entity/service-gallery.entity';
import cloudinary from 'src/upload/cloudinary.provider';

@Injectable()
export class GalleryService {
    constructor(
        @InjectRepository(ServiceGallery)
        private repo: Repository<ServiceGallery>,
    ) { }
    async find(section_id: number) {
        return this.repo.find({
            where: { section_id },
            order: { sort_order: 'ASC' }
        });
    }

    async create(file: Express.Multer.File, dto: any) {

        const upload: any = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                { folder: 'portfolio', resource_type: 'auto' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            stream.end(file.buffer);
        });

        const data = this.repo.create({
            ...dto,
            url: upload.secure_url,
            public_id: upload.public_id,
            resource_type: upload.resource_type
        });

        return this.repo.save(data);
    }

    async update(id: number, dto: any) {

        const media = await this.repo.findOne({ where: { id } });

        if (!media) throw new NotFoundException('Gallery item not found');

        await this.repo.update(id, dto);

        return this.repo.findOne({ where: { id } });
    }

    async replace(id: number, file: Express.Multer.File) {

        const media = await this.repo.findOne({ where: { id } });

        if (!media) throw new NotFoundException('Gallery item not found');

        // delete old
        if (media.public_id) {
            await cloudinary.uploader.destroy(media.public_id, {
                resource_type: media.resource_type || 'image'
            });
        }

        // upload new
        const upload: any = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                { folder: 'portfolio', resource_type: 'auto' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            stream.end(file.buffer);
        });

        await this.repo.update(id, {
            url: upload.secure_url,
            public_id: upload.public_id,
            resource_type: upload.resource_type
        });

        return this.repo.findOne({ where: { id } });
    }

    async delete(id: number) {

        const media = await this.repo.findOne({ where: { id } });

        if (!media) throw new NotFoundException('Gallery item not found');

        if (media.public_id) {
            await cloudinary.uploader.destroy(media.public_id, {
                resource_type: media.resource_type || 'image'
            });
        }

        await this.repo.delete(id);

        return { message: 'Deleted successfully' };
    }
}
