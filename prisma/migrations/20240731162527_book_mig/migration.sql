/*
 Warnings:
 
 - Added the required column `updatedAt` to the `books` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "books"
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW();
-- CreateTable
CREATE TABLE "Chapter" (
  "id" SERIAL NOT NULL,
  "bookId" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE INDEX "Chapter_bookId_idx" ON "Chapter"("bookId");
-- AddForeignKey
ALTER TABLE "Chapter"
ADD CONSTRAINT "Chapter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;