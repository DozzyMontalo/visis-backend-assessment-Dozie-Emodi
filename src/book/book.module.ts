import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import OpenAI from 'openai';

@Module({
  controllers: [BookController],
  providers: [BookService, OpenAI]
})
export class BookModule {}
