/*
  Warnings:

  - You are about to drop the column `url` on the `BookImages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookImages" DROP COLUMN "url";

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "ext" TEXT NOT NULL,
    "parentType" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "book_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);
