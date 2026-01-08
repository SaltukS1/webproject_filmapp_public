import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Film } from './film.entity';
import { User } from './user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  rating: number; 

  @Column('text')
  reviewText: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Film, (film) => film.reviews, { onDelete: 'CASCADE' })
  film: Film;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  author: User;
}
