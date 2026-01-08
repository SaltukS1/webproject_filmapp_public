import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { Film } from '../entities/film.entity';
import { FilmGenre } from '../entities/film-genre.entity';
import { FilmCredit } from '../entities/film-credit.entity';
import { Genre } from '../entities/genre.entity';
import { Person } from '../entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Film, FilmGenre, FilmCredit, Genre, Person])],
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [FilmsService],
})
export class FilmsModule {}
