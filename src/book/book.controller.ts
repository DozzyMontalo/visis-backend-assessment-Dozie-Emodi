import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto';
import { title } from 'process';

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService){}

    @Post()
    create(@Body() book: CreateBookDto){
        return this.bookService.create(book)
    }

    @Get()
    findAll(){
        return this.bookService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return this.bookService.findOne(+id);
    }

    @Patch(':id')
    remove(@Param('id') id: string){
        return this.bookService.remove(+id);
    }

    @Get('search/title')
    findByTitle(@Query('title') title: string){
        return this.bookService.findByTitle(title);
    }

    @Get('search/publisher')
    findByPublisher(@Query('publisher') publisher: string){
        return this.bookService.findByPublisher(publisher);
    }
}
