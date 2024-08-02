-- DropIndex
DROP INDEX "books_publisher_key";

-- CreateIndex
CREATE INDEX "books_publisher_idx" ON "books"("publisher");
