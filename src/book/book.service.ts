import * as fs from "fs";
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import OpenAI from 'openai';
import { CreateBookDto, UpdateBookDto, CreateChapterDto } from './dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService, private config: ConfigService,  private openai: OpenAI) {
    const apiKey = this.config.get('OPENAI_API_KEY'); 
    this.openai = new OpenAI({
      apiKey: apiKey,
    })
  }

  async createBook(createBookDto: CreateBookDto) {
    const { chapters, ...bookData } = createBookDto;

    const book = await this.prisma.book.create({
      data: {
        ...bookData,
        chapters: {
          create: chapters,
        },
      },
    });

    return book;
  }

  async addChapter(createChapterDto: CreateChapterDto) {
    return this.prisma.chapter.create({
      data: createChapterDto,
    });
  }

  async findAll() {
    return this.prisma.book.findMany();
  }

  async findOne(id: number) {
    return this.prisma.book.findUnique({ where: { id } });
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto) {
    const { chapters, ...bookData } = updateBookDto;

    try {
      const book = await this.prisma.book.update({
        where: { id: id },
        data: { ...bookData },
      });

      if (!book) {
        throw new Error('Book not found');
      }

      if (chapters) {
        await this.prisma.chapter.deleteMany({
          where: { bookId: id },
        });

        for (const chapter of chapters) {
          await this.prisma.chapter.create({
            data: {
              bookId: id,
              ...chapter,
            },
          });
        }
      }

      return book;
    } catch (error) {
      throw error.message;
    }
  }

  async findByTitle(title: string) {
    return this.prisma.book.findFirst({ where: { title } });
  }

  async findByPublisher(publisher: string) {
    try {
      const books = await this.prisma.book.findMany({
        where: { publisher },
      });
      return books;
    } catch (error) {
      throw new Error('An error occurred while searching for books by publisher');
    }
  }

  async generateSummary(id: number, chapterId?: number): Promise<{ chapterId?: number; bookTitle?: string; summary: string; audioPath?: string }> {
    try {
      // Fetch the book information
      const book = await this.prisma.book.findUnique({
        where: { id },
        include: { chapters: true },
      });
  
      if (!book) {
        throw new NotFoundException('Book not found');
      }
  
      let summaryText: string;
      if (chapterId) {
        const chapter = book.chapters.find(c => c.id === chapterId);
  
        if (!chapter) {
          throw new NotFoundException('Chapter not found');
        }
        summaryText = chapter.content;
      } else {
        summaryText = book.chapters.map(chapter => chapter.content).join(' ');
      }
  
      // Generate summary using OpenAI
      let summary: string;
      try {
        const response = await this.openai.chat.completions.create({
          messages: [{ role: "user", content: `Summarize the following text: ${summaryText}` }],
          model: "gpt-3.5-turbo",
        });
  
        summary = response.choices[0].message.content.trim();
        console.log(summary); // debug
  
      } catch (error) {
        console.error('OpenAI API error:', error);
        throw new Error('Error generating summary');
      }
  
      // Generate the audio file from the summary text
      let audioFilePat: string;
      try {
        let audioFilePath = process.cwd() + "/speech.mp3";

        audioFilePat = audioFilePath
  
        const mp3 = await this.openai.audio.speech.create({
          model: "tts-1",
          voice: "alloy",
          input: summary,
        });
  
        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(audioFilePath, buffer);
        
        console.log(`Audio file saved to: ${audioFilePath}`);
  
      } catch (error) {
        console.error('Text-to-Speech API error:', error);
        throw new Error('Error generating audio');
      }
  
      if (chapterId) {
        return { chapterId, summary, audioPath: audioFilePat };
      } else {
        return { bookTitle: book.title, summary, audioPath: audioFilePat };
      }
    } catch (error) {
      console.error('General error:', error);
      throw new Error(`Error generating summary: ${error.message}`);
    }
  }

  async remove(id: number) {
    await this.prisma.chapter.deleteMany({
      where: { bookId: id },
    });
    return this.prisma.book.delete({ where: { id } });
  }
  
}
