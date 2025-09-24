/*
  Warnings:

  - A unique constraint covering the columns `[book_id,borrower_id]` on the table `borrowing_process` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."borrowing_process_book_id_borrower_id_idx";

-- AlterTable
ALTER TABLE "public"."books" ALTER COLUMN "quantity" SET DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "borrowing_process_book_id_borrower_id_key" ON "public"."borrowing_process"("book_id", "borrower_id");
