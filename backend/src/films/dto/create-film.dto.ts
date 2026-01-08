import { IsNotEmpty, IsString, IsInt, IsUrl, IsOptional } from 'class-validator';

export class CreateFilmDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsInt()
  releaseYear: number;

  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  posterUrl: string;

  @IsOptional()
  @IsString()
  synopsis?: string;
}
