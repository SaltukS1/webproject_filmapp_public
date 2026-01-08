import { IsArray, IsUUID, ValidateNested, IsNotEmpty, IsEnum, IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { CreditType } from '../../entities/film-credit.entity';

export class UpdateFilmGenresDto {
  @IsArray()
  @IsUUID('all', { each: true })
  genreIds: string[];
}

class CreditItemDto {
  @IsNotEmpty()
  @IsUUID()
  personId: string;

  @IsNotEmpty()
  @IsEnum(CreditType)
  creditType: CreditType;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

export class UpdateFilmCreditsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreditItemDto)
  credits: CreditItemDto[];
}
