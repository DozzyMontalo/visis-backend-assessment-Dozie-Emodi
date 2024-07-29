import { IsString, IsNotEmpty } from "class-validator";

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    publisher: string;

    @IsString()
    summary: string;
  }