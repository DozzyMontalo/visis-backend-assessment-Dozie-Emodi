import { IsOptional, IsString } from 'class-validator';

export class UpdateBookDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    publisher?: string;

    @IsString()
    @IsOptional()
    summary?: string;
  }