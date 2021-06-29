/*
  Warnings:

  - Added the required column `ext` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "ext" TEXT NOT NULL;
