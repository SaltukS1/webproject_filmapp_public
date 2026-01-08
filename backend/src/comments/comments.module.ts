import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from '../entities/comment.entity';
import { Film } from '../entities/film.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Film])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
