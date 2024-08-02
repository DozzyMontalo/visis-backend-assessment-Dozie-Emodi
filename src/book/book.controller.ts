import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto, CreateChapterDto, Book} from './dto';
import { ApiTags, ApiResponse, ApiOkResponse, ApiNotFoundResponse, ApiCreatedResponse, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  
  @ApiOperation({ summary: 'Create a new book' })
  @ApiCreatedResponse({ description: 'The book has been successfully created.', type: CreateBookDto })
  @Post('create')
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }
  
  @ApiOperation({ summary: 'Add a chapter to a book' })
  @ApiParam({ name: 'bookId', description: 'The ID of the book' })
  @ApiBody({ type: CreateChapterDto })
  @Post('chapters/:bookid')
  addChapter(@Body() createChapterDto: CreateChapterDto) {
    return this.bookService.addChapter(createChapterDto);
  }
  
  @ApiOperation({ summary: 'Find all books' })
  @ApiResponse({ description: 'The list of books', type: [Book] })
  @Get('all')
  findAll() {
    return this.bookService.findAll();
  }
  
  @ApiOperation({ summary: 'Find a book by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the book' })
  @ApiOkResponse({ description: 'The book', type: Book  })
  @ApiNotFoundResponse({ description: 'Book not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }
  
  @ApiOperation({ summary: 'Update a book by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the book to update' })
  @ApiBody({ type: UpdateBookDto })
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
  try {
    const numericId = Number(id); 
    return await this.bookService.updateBook(numericId, updateBookDto);
  } catch (error) {
    return error.message;
  }
}
 @ApiOperation({ summary: 'Find books by title' })
 @ApiQuery({ name: 'title', description: 'The title of the book' })
 @ApiOkResponse({ description: 'The book', type: Book })
 @Get('search/title')
  findByTitle(@Query('title') title: string) {
    return this.bookService.findByTitle(title);
  }

  @ApiOperation({ summary: 'Find books by publisher' })
  @ApiQuery({ name: 'publisher', description: 'The publisher of the book' })
  @ApiOkResponse({ description: 'The list of books', type: [Book] })
  @Get('search/publisher')
  findByPublisher(@Query('publisher') publisher: string) {
    return this.bookService.findByPublisher(publisher);
  }
 
 @ApiOperation({ summary: 'Get book summary' })
 @ApiParam({ name: 'bookId', description: 'The ID of the book' })
 @ApiQuery({ name: 'chapterId', description: 'The ID of the chapter (optional)', required: false })
 @ApiOkResponse({ description: 'The book summary', type: String })
 @Get(':bookId/summary')
 async getBookSummary(@Param('bookId') bookId: string, @Query('chapterId') chapterId?: string) {
  try {
    const summary = await this.bookService.generateSummary(Number(bookId), chapterId ? Number(chapterId) : undefined);
    return summary;
  } catch (error) {
    return error.message;
  }
}

@ApiOperation({ summary: 'Delete a book by ID' })
@ApiParam({ name: 'id', description: 'The ID of the book to delete' })
@ApiOkResponse({ description: 'The book has been deleted' })
@ApiNotFoundResponse({ description: 'Book not found' })
@Delete(':id')
async remove(@Param('id') id: string) {
  const book = await this.bookService.remove(+id);
  return `${book.title} has been deleted`
}

}
