import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { UpdateFilmGenresDto, UpdateFilmCreditsDto } from './dto/update-relations.dto';
import { Film } from '../entities/film.entity';
import { FilmGenre } from '../entities/film-genre.entity';
import { FilmCredit } from '../entities/film-credit.entity';
import { Genre } from '../entities/genre.entity';
import { Person } from '../entities/person.entity';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    @InjectRepository(FilmGenre)
    private filmGenreRepository: Repository<FilmGenre>,
    @InjectRepository(FilmCredit)
    private filmCreditRepository: Repository<FilmCredit>,
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {}

  create(createFilmDto: CreateFilmDto) {
    const film = this.filmRepository.create(createFilmDto);
    return this.filmRepository.save(film);
  }

  findAll() {
    return this.filmRepository.find({
      select: ['id', 'title', 'posterUrl', 'releaseYear'],
    });
  }

  async findOne(id: string) {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: [
        'filmGenres',
        'filmGenres.genre',
        'filmCredits',
        'filmCredits.person',
        'reviews',
        'reviews.author',
        'comments',
        'comments.author',
      ],
      order: {
        comments: {
          createdAt: 'DESC',
        },
      },
    });
    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
    return film;
  }

  async update(id: string, updateFilmDto: UpdateFilmDto) {
    const film = await this.filmRepository.findOne({ where: { id } }); 
    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
    Object.assign(film, updateFilmDto);
    return this.filmRepository.save(film);
  }

  async remove(id: string) {
    const result = await this.filmRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
    return { deleted: true };
  }

  async updateGenres(id: string, updateFilmGenresDto: UpdateFilmGenresDto) {
    const film = await this.filmRepository.findOne({ where: { id } });
    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }

    
    await this.filmGenreRepository.delete({ film: { id } });

    
    const genres: FilmGenre[] = [];
    for (const genreId of updateFilmGenresDto.genreIds) {
      const genre = await this.genreRepository.findOne({ where: { id: genreId } });
      if (genre) {
        const filmGenre = this.filmGenreRepository.create({
          film,
          genre,
        });
        genres.push(filmGenre);
      }
    }
    await this.filmGenreRepository.save(genres);
    return { success: true, count: genres.length };
  }

  async updateCredits(id: string, updateFilmCreditsDto: UpdateFilmCreditsDto) {
    const film = await this.filmRepository.findOne({ where: { id } });
    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }

    
    await this.filmCreditRepository.delete({ film: { id } });

    
    const credits: FilmCredit[] = [];
    for (const creditDto of updateFilmCreditsDto.credits) {
      const person = await this.personRepository.findOne({
        where: { id: creditDto.personId },
      });
      if (person) {
        const filmCredit = this.filmCreditRepository.create({
          film,
          person,
          creditType: creditDto.creditType,
          orderIndex: creditDto.orderIndex,
        });
        credits.push(filmCredit);
      }
    }
    await this.filmCreditRepository.save(credits);
    return { success: true, count: credits.length };
  }
}
