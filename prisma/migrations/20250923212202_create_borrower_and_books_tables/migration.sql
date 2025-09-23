/*
  Warnings:

  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."books" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "shelf_location" TEXT NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."borrowing_process" (
    "id" SERIAL NOT NULL,
    "borrower_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3),

    CONSTRAINT "borrowing_process_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "books_isbn_key" ON "public"."books"("isbn");

-- CreateIndex
CREATE INDEX "books_title_idx" ON "public"."books"("title");

-- CreateIndex
CREATE INDEX "books_author_idx" ON "public"."books"("author");

-- CreateIndex
CREATE INDEX "borrowing_process_book_id_borrower_id_idx" ON "public"."borrowing_process"("book_id", "borrower_id");

-- CreateIndex
CREATE INDEX "borrowing_process_due_date_idx" ON "public"."borrowing_process"("due_date");

-- AddForeignKey
ALTER TABLE "public"."borrowing_process" ADD CONSTRAINT "borrowing_process_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."borrowing_process" ADD CONSTRAINT "borrowing_process_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
