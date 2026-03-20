import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceGallery } from 'src/entity/service-gallery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceGallery])],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
