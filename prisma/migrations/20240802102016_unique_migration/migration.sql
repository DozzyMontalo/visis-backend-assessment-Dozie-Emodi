/*
  Warnings:

  - A unique constraint covering the columns `[publisher]` on the table `books` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "books_publisher_key" ON "books"("publisher");
