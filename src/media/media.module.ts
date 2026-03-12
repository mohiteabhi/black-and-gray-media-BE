import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/entity/media.entity';
import { MediaController } from 'src/media/media.controller';
import { MediaService } from 'src/media/media.service';

@Module({
    imports: [TypeOrmModule.forFeature([Media])],
    controllers: [MediaController],
    providers: [MediaService],
})
export class MediaModule { }
