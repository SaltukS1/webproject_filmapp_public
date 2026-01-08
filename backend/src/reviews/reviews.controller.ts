import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('films/:filmId/reviews')
  findByFilm(@Param('filmId') filmId: string) {
    return this.reviewsService.findByFilm(filmId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('films/:filmId/reviews')
  upsert(
    @Param('filmId') filmId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Request() req,
  ) {
    return this.reviewsService.upsert(filmId, createReviewDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('reviews/:id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
