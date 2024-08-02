import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateBookDto, UpdateBookDto, CreateChapterDto } from '../src/book/dto';

describe('Book API e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);
    await prisma.cleanDb(); // Ensure your Prisma service has a cleanDb method for testing
    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Books', () => {
    let bookId: number;

    it('should create a book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Sample Book',
        publisher: 'Sample Publisher',
        chapters: [{ title: 'Chapter 1', content: 'Content of Chapter 1' }],
      };
  
      const response = await pactum.spec()
        .post('/books/create')
        .withJson(createBookDto)
        .expectStatus(201)
  
      const bookId = response.body.id;
      expect(bookId).toBeDefined();
      globalThis.bookId = bookId; 
    });
  
    it('should get a book by ID', async () => {
      const bookId = globalThis.bookId; 
  
      await pactum.spec()
        .get(`/books/${bookId}`)
        .expectStatus(200);
    });

    it('should find all books', async () => {
      await pactum.spec()
        .get('/books/all')
        .expectStatus(200);
    });

    it('should find a book by ID', async () => {
      await pactum.spec()
        .get(`/books/${bookId}`)
        .expectStatus(200);
    });

    it('should update a book by ID', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Test Book',
        publisher: 'Updated Test Publisher',
        chapters: [{ title: 'Updated Chapter 1', content: 'Updated content of Chapter 1' }],
      };

      await pactum.spec()
        .patch(`/books/update/${bookId}`)
        .withBody(updateBookDto)
        .expectStatus(200);
    });

    it('should find books by title', async () => {
      await pactum.spec()
        .get('/books/search/title')
        .withQueryParams('title', 'Updated Test Book')
        .expectStatus(200);
    });

    it('should find books by publisher', async () => {
      await pactum.spec()
        .get('/books/search/publisher')
        .withQueryParams('publisher', 'Updated Test Publisher')
        .expectStatus(200);
    });

    it('should generate summary of the book', async () => {
      await pactum.spec()
        .get(`/books/${bookId}/summary`)
        .expectStatus(200);
    });

    it('should delete a book by ID', async () => {
      await pactum.spec()
        .delete(`/books/${bookId}`)
        .expectStatus(200);
    });
  });

  describe('Chapters', () => {
    let chapterId: number;

    it('should add a chapter to a book', async () => {
      const createChapterDto: CreateChapterDto = {
        bookId: globalThis.bookId,
        title: 'New Chapter',
        content: 'Content of the new chapter',
      };

      const res = await pactum.spec()
        .post(`/books/chapters/${globalThis.bookId}`)
        .withBody(createChapterDto)
        .expectStatus(201);

      chapterId = res.body.id;
      expect(res.body).toMatchObject(createChapterDto);
    });

    it('should update a chapter', async () => {
      const updateChapterDto: CreateChapterDto = {
        bookId: globalThis.bookId,
        title: 'Updated Chapter Title',
        content: 'Updated content of the chapter',
      };

      await pactum.spec()
        .patch(`/chapters/${chapterId}`)
        .withBody(updateChapterDto)
        .expectStatus(200);
    });

    it('should delete a chapter', async () => {
      await pactum.spec()
        .delete(`/chapters/${chapterId}`)
        .expectStatus(200);
    });
  });
});
