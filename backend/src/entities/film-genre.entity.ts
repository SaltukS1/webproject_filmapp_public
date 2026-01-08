import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { Film } from './film.entity';
import { Genre } from './genre.entity';

@Entity('film_genres')
@Unique(['film', 'genre'])
export class FilmGenre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Film, (film) => film.filmGenres, { onDelete: 'CASCADE' })
  film: Film;

  @ManyToOne(() => Genre, (genre) => genre.filmGenres, { onDelete: 'CASCADE' })
  genre: Genre;
}
