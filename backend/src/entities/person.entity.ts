import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FilmCredit } from './film-credit.entity';

@Entity('persons')
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ default: 'ACTOR' })
  primaryRole: 'ACTOR' | 'DIRECTOR';

  @OneToMany(() => FilmCredit, (filmCredit) => filmCredit.person)
  filmCredits: FilmCredit[];
}
