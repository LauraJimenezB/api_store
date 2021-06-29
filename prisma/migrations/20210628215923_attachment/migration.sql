/*
  Warnings:

  - You are about to drop the column `ext` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `Attachment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "ext",
DROP COLUMN "path";
