import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from '../entities/person.entity';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {}

  create(createPersonDto: CreatePersonDto) {
    const person = this.personRepository.create(createPersonDto);
    return this.personRepository.save(person);
  }

  findAll(role?: 'ACTOR' | 'DIRECTOR') {
    if (role) {
      return this.personRepository.find({ where: { primaryRole: role } });
    }
    return this.personRepository.find();
  }

  async findOne(id: string) {
    const person = await this.personRepository.findOne({ where: { id } });
    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }
    return person;
  }

  async getPersonFilms(id: string) {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: ['filmCredits', 'filmCredits.film'],
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    
    const filmsMap = new Map();
    if (person.filmCredits) {
      person.filmCredits.forEach((credit) => {
        if (credit.film) {
          filmsMap.set(credit.film.id, credit.film);
        }
      });
    }

    return Array.from(filmsMap.values());
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    const person = await this.findOne(id);
    Object.assign(person, updatePersonDto);
    return this.personRepository.save(person);
  }

  async remove(id: string) {
    const result = await this.personRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
