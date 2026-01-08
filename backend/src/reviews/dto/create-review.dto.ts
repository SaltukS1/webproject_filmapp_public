import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @IsNotEmpty()
  @IsString()
  reviewText: string;
}
