import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto, UpdateBookDto } from './dto';

@Injectable()
export class BookService{
    constructor(private prisma:PrismaService){}

  async create(data: CreateBookDto) {
    const newBook = await this.prisma.book.create({data});
    return newBook;
  }

  async findAll(){
    return this.prisma.book.findMany();
  }

  async findOne(id: number){
      return this.prisma.book.findUnique({where: {id}});
  }

  async update(id: number, data: UpdateBookDto){
    return this.prisma.book.update({where: {id}, data});
  }

  async remove(id: number){
    return this.prisma.book.delete({where: {id}})
  }

  async findByTitle(title: string){
    return await this.prisma.book.findMany({where: {title}})
  }

  async findByPublisher(publisher: string) {
    return await this.prisma.book.findMany({ where: { publisher } });
  }
}
