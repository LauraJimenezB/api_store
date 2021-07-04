-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "hashActivation" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "authors" TEXT[],
    "editorial" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "favourites" INTEGER[],
    "category_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saleStatus" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookSale" (
    "id" SERIAL NOT NULL,
    "sale_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_total" DOUBLE PRECISION NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentType" TEXT NOT NULL,
    "ext" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AttachmentToBook" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Role.name_unique" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category.name_unique" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_AttachmentToBook_AB_unique" ON "_AttachmentToBook"("A", "B");

-- CreateIndex
CREATE INDEX "_AttachmentToBook_B_index" ON "_AttachmentToBook"("B");

-- AddForeignKey
ALTER TABLE "UserRole" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookSale" ADD FOREIGN KEY ("sale_id") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookSale" ADD FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttachmentToBook" ADD FOREIGN KEY ("A") REFERENCES "Attachment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttachmentToBook" ADD FOREIGN KEY ("B") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
