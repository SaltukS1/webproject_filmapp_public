import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from '../entities/comment.entity';
import { Film } from '../entities/film.entity';
import { User, UserRole } from '../entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
  ) {}

  async findByFilm(filmId: string) {
    return this.commentRepository.find({
      where: { film: { id: filmId } },
      relations: ['author'],
      select: {
        author: {
          id: true,
          name: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async create(filmId: string, createCommentDto: CreateCommentDto, user: User) {
    const film = await this.filmRepository.findOne({ where: { id: filmId } });
    if (!film) {
      throw new NotFoundException(`Film with ID ${filmId} not found`);
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      film,
      author: user,
    });

    return this.commentRepository.save(comment);
  }

  async remove(id: string, user: User) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (user.role !== UserRole.ADMIN && comment.author.id !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.remove(comment);
    return { deleted: true };
  }
}
