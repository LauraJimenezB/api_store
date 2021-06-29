/*
  Warnings:

  - Added the required column `contentType` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ext` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "contentType" TEXT NOT NULL,
ADD COLUMN     "ext" INTEGER NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL;
