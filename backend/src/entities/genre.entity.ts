import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FilmGenre } from './film-genre.entity';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => FilmGenre, (filmGenre) => filmGenre.genre)
  filmGenres: FilmGenre[];
}
