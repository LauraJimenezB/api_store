/*
  Warnings:

  - You are about to drop the column `path` on the `BookImages` table. All the data in the column will be lost.
  - Added the required column `key` to the `BookImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `BookImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookImages" DROP COLUMN "path",
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
