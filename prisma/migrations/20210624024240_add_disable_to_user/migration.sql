/*
  Warnings:

  - You are about to alter the column `price` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "BookSale" ALTER COLUMN "price_total" SET DATA TYPE DOUBLE PRECISION;
