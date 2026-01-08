import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from '../entities/review.entity';
import { Film } from '../entities/film.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
  ) {}

  async findByFilm(filmId: string) {
    return this.reviewRepository.find({
      where: { film: { id: filmId } },
      relations: ['author'],
    });
  }

  async upsert(filmId: string, createReviewDto: CreateReviewDto, user: User) {
    const film = await this.filmRepository.findOne({ where: { id: filmId } });
    if (!film) {
      throw new NotFoundException(`Film with ID ${filmId} not found`);
    }

    let review = await this.reviewRepository.findOne({
      where: { film: { id: filmId }, author: { id: user.id } },
    });

    if (review) {
      
      review.rating = createReviewDto.rating;
      review.reviewText = createReviewDto.reviewText;
    } else {
      
      review = this.reviewRepository.create({
        ...createReviewDto,
        film,
        author: user,
      });
    }

    return this.reviewRepository.save(review);
  }

  async remove(id: string) {
    const result = await this.reviewRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
