import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from '../entities/review.entity';
import { Film } from '../entities/film.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Film])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
