import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Review } from './review.entity';
import { Comment } from './comment.entity';
import { FilmGenre } from './film-genre.entity';
import { FilmCredit } from './film-credit.entity';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('int')
  releaseYear: number;

  @Column()
  posterUrl: string;

  @Column({ nullable: true, type: 'text' })
  synopsis: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Review, (review) => review.film)
  reviews: Review[];

  @OneToMany(() => Comment, (comment) => comment.film)
  comments: Comment[];

  @OneToMany(() => FilmGenre, (filmGenre) => filmGenre.film)
  filmGenres: FilmGenre[];

  @OneToMany(() => FilmCredit, (filmCredit) => filmCredit.film)
  filmCredits: FilmCredit[];
}
