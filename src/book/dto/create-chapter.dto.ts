import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateChapterDto {
  @IsInt()
  bookId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
