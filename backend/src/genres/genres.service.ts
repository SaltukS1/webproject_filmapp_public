import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from '../entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  create(createGenreDto: CreateGenreDto) {
    const genre = this.genreRepository.create(createGenreDto);
    return this.genreRepository.save(genre);
  }

  findAll() {
    return this.genreRepository.find();
  }

  async findOne(id: string) {
    const genre = await this.genreRepository.findOne({ where: { id } });
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    return genre;
  }

  async findFilmsByGenre(id: string) {
    const genre = await this.genreRepository.findOne({
      where: { id },
      relations: ['filmGenres', 'filmGenres.film'],
    });
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    
    return genre.filmGenres.map((fg) => fg.film);
  }

  async update(id: string, updateGenreDto: UpdateGenreDto) {
    const genre = await this.findOne(id);
    Object.assign(genre, updateGenreDto);
    return this.genreRepository.save(genre);
  }

  async remove(id: string) {
    const result = await this.genreRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
