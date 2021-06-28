import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { AttachmentsService } from '../attachments/services/attachments.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PrismaService } from '../common/services/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ShowCartItemDto } from './dto/showcart-item.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ReadProductEntity } from './entities/read-product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private attachmentsService: AttachmentsService,
  ) {}

  async getAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<ReadProductEntity[]> {
    const { limit, offset } = paginationQueryDto;

    const categories = await this.prisma.category.findMany();
    const books = await this.prisma.book.findMany({
      skip: offset,
      take: limit,
      where: {
        disabled: false,
      },
    });
    const prods = books.map((prod) => {
      return {
        ...prod,
        favourites: prod.favourites.length,
        categoryName: categories.filter((c) => c.id === prod.categoryId)[0]
          .name,
      };
    });
    return plainToClass(ReadProductEntity, prods);
  }

  async get(id: number): Promise<ReadProductEntity> {
    const book = await this.prisma.book.findUnique({
      where: { id: id },
    });
    if (!book) {
      throw new NotFoundException();
    }
    const categories = await this.prisma.category.findMany();
    const prod = plainToClass(ReadProductEntity, book);
    prod.favourites = book.favourites.length;
    prod.categoryName = categories.filter(
      (c) => c.id === book.categoryId,
    )[0].name;
    return prod;
  }

  async create(createDto: CreateProductDto): Promise<ReadProductEntity> {
    const category = await this.preloadCategoryByName(
      createDto.category.toLowerCase(),
    );
    await this.prisma.book.create({
      data: {
        name: createDto.name,
        authors: createDto.authors,
        editorial: createDto.editorial,
        price: createDto.price,
        stock: createDto.stock,
        categoryId: category.id,
      },
    });
    return plainToClass(ReadProductEntity, createDto);
  }

  async update(
    id: number,
    updateDto: UpdateProductDto,
  ): Promise<ReadProductEntity> {
    const book = await this.prisma.book.findUnique({
      where: { id: id },
      include: { category: true },
    });
    if (!book) {
      throw new NotFoundException();
    }
    const category = updateDto.category
      ? await this.preloadCategoryByName(updateDto.category)
      : null;

    const updatedBook = await this.prisma.book.update({
      where: {
        id: id,
      },
      data: {
        name: updateDto.name,
        authors: updateDto.authors,
        editorial: updateDto.editorial,
        price: updateDto.price,
        stock: updateDto.stock,
        categoryId: category ? category.id : book.categoryId,
      },
    });
    const prod: ReadProductEntity = {
      name: updatedBook.name,
      authors: updatedBook.authors,
      editorial: updatedBook.editorial,
      price: updatedBook.price,
      stock: updatedBook.stock,
      disabled: updatedBook.disabled,
      categoryName: category ? category.name : book.category.name,
      favourites: updatedBook.favourites.length,
    };
    return prod;
  }

  async delete(id: number): Promise<ReadProductEntity> {
    const book = await this.prisma.book.findUnique({
      where: { id: id },
    });
    if (!book) {
      throw new NotFoundException();
    }
    await this.prisma.book.delete({
      where: {
        id: id,
      },
    });
    return plainToClass(ReadProductEntity, book);
  }

  async getByCategory(name: string): Promise<ReadProductEntity[]> {
    const category = await this.prisma.category.findFirst({
      where: { name: name.toLowerCase() },
    });

    const books = await this.prisma.book.findMany({
      where: { categoryId: category.id },
    });
    const prods = books.map((prod) => {
      const prodToReturn: ReadProductEntity = {
        ...prod,
        favourites: prod.favourites.length,
        categoryName: category.name,
      };
      return prodToReturn;
    });
    return plainToClass(ReadProductEntity, prods);
  }

  async disable(id: number): Promise<ReadProductEntity> {
    const prod = await this.prisma.book.update({
      where: {
        id: id,
      },
      data: {
        disabled: true,
      },
    });
    return plainToClass(ReadProductEntity, prod);
  }

  async enable(id: number): Promise<ReadProductEntity> {
    const prod = await this.prisma.book.update({
      where: {
        id: id,
      },
      data: {
        disabled: false,
      },
    });
    return plainToClass(ReadProductEntity, prod);
  }

  private async preloadCategoryByName(name: string): Promise<Category> {
    const preCategory = await this.prisma.category.findUnique({
      where: { name: name },
    });
    if (preCategory) {
      return preCategory;
    }
    return await this.prisma.category.create({ data: { name } });
  }

  async like(userId: number, productId: number): Promise<any> {
    const book = await this.prisma.book.findUnique({
      where: {
        id: productId,
      },
    });

    if (!book) {
      throw new NotFoundException();
    }

    const alreadyLiked = book.favourites.includes(Number(userId));

    if (alreadyLiked) {
      return book;
    }
    const updatedBook = await this.prisma.book.update({
      where: {
        id: productId,
      },
      data: {
        favourites: {
          push: userId,
        },
      },
    });
    return updatedBook;
  }

  async unlike(userId: number, productId: number): Promise<any> {
    const book = await this.prisma.book.findUnique({
      where: {
        id: productId,
      },
    });

    if (!book) {
      throw new NotFoundException();
    }

    const alreadyLiked = book.favourites.includes(userId);

    if (alreadyLiked) {
      const newFavArray = book.favourites.filter((fav) => fav != userId);

      const updatedBook = await this.prisma.book.update({
        where: {
          id: productId,
        },
        data: {
          favourites: newFavArray,
        },
      });
      return updatedBook;
    }
    return book;
  }

  async addToCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<ShowCartItemDto> {
    const book = await this.prisma.book.findUnique({
      where: {
        id: productId,
      },
    });
    if (!book) {
      throw new NotFoundException();
    }
    if (book.stock < quantity) {
      throw new NotAcceptableException(
        'The quantity is greater that the stock available',
      );
    }
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const getAlreadyInCart = await this.prisma.cart.findFirst({
      where: {
        userId: userId,
        bookId: productId,
      },
    });
    if (!getAlreadyInCart) {
      await this.prisma.cart.create({
        data: {
          userId: userId,
          bookId: productId,
          quantity: quantity,
        },
      });
    }

    await this.prisma.cart.update({
      where: {
        id: getAlreadyInCart.id,
      },
      data: {
        quantity: quantity,
      },
    });

    const cartItem = plainToClass(ShowCartItemDto, {
      username: user.username,
      title: book.name,
      quantity: quantity,
      price: book.price,
      pricetotal: quantity * book.price,
    });
    return cartItem;
  }

  async addPrivateFile(bookId: number, imageBuffer: Buffer, filename: string) {
    return this.attachmentsService.uploadImages(imageBuffer, bookId, filename);
  }
}
