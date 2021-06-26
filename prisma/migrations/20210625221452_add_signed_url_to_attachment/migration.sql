/*
  Warnings:

  - Added the required column `path` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signedUrl` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "signedUrl" TEXT NOT NULL;
