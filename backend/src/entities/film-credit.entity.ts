import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Film } from './film.entity';
import { Person } from './person.entity';

export enum CreditType {
  ACTOR = 'ACTOR',
  DIRECTOR = 'DIRECTOR',
}

@Entity('film_credits')
@Unique(['film', 'person', 'creditType'])
export class FilmCredit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Film, (film) => film.filmCredits, { onDelete: 'CASCADE' })
  film: Film;

  @ManyToOne(() => Person, (person) => person.filmCredits, { onDelete: 'CASCADE' })
  person: Person;

  @Column({
    type: 'simple-enum',
    enum: CreditType,
  })
  creditType: CreditType;

  @Column({ nullable: true, type: 'int' })
  orderIndex: number;
}
