import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { OpenAIApi, Configuration } from 'openai';
import { CreateBookDto, UpdateBookDto, CreateChapterDto } from './dto';

@Injectable()
export class BookService {
  private openai: OpenAIApi;

  constructor(private prisma: PrismaService, private config: ConfigService) {
    const configuration = new Configuration({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });
    this.openai = new OpenAIApi(configuration);
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

  async generateSummary(id: number, chapterId?: number): Promise<{ chapterId?: number; bookTitle?: string; summary: string }> {
  
    const book = await this.prisma.book.findUnique({
      where: { id: Number(id) },
      include: { chapters: true },
    });
  
    if (!book) {
      throw new NotFoundException('Book not found');
    }
  
    let summaryText;
    if (chapterId) {
      const chapter = book.chapters.find(c => c.id === chapterId);
  
      if (!chapter) {
        throw new NotFoundException('Chapter not found');
      }
      summaryText = chapter.content;
    } else {
      summaryText = book.chapters.map(chapter => chapter.content).join(' ');
    }
  
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Summarize the following text: ${summaryText}` }],
        max_tokens: 150,
        temperature: 0.3,
      });
  
      const summary = response.data.choices[0].message.content.trim();
      if (chapterId) {
        return { chapterId, summary };
      } else {
        return { bookTitle: book.title, summary };
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Error generating summary');
    }
  }

  async remove(id: number) {
    await this.prisma.chapter.deleteMany({
      where: { bookId: id },
    });
    return this.prisma.book.delete({ where: { id } });
  }
  
}
