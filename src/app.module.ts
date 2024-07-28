import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './book/book.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BookModule
  ],
  
})
export class AppModule {}
