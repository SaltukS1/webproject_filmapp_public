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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('films/:filmId/comments')
  findByFilm(@Param('filmId') filmId: string) {
    return this.commentsService.findByFilm(filmId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('films/:filmId/comments')
  create(
    @Param('filmId') filmId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.create(filmId, createCommentDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  remove(@Param('id') id: string, @Request() req) {
    return this.commentsService.remove(id, req.user);
  }
}
