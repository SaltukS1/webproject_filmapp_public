import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Film } from './film.entity';
import { User } from './user.entity';

@Entity('comments')
@Index(['film', 'author']) 
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  commentText: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Film, (film) => film.comments, { onDelete: 'CASCADE' })
  film: Film;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  author: User;
}
