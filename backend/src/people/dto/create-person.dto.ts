import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePersonDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  primaryRole?: 'ACTOR' | 'DIRECTOR';
}
