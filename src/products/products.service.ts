import { Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime';
import { plainToClass } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PrismaService } from '../common/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ReadProductEntity } from './entities/read-product.entity';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(paginationQueryDto: PaginationQueryDto): Promise<any[]> {
    const { limit, offset } = paginationQueryDto;

    const categories = await this.prisma.category.findMany();
    const products = await this.prisma.book.findMany({
      skip: offset,
      take: limit,
    });
    const prods = products.map((prod) => {
      return {
        ...prod,
        favourites: prod.favourites.length,
        categoryName: categories.filter((c) => c.id === prod.categoryId)[0]
          .name,
      };
    });
    //plainToClass: error
    return plainToClass(ReadProductEntity, prods);
    //return prods;
  }

  async getProduct(id: number): Promise<any> {
    const categories = await this.prisma.category.findMany();
    const product = await this.prisma.book.findUnique({
      where: { id: id },
    });
    const prod = plainToClass(ReadProductEntity, product);
    prod.favourites = product.favourites.length;
    prod.categoryName = categories.filter(
      (c) => c.id === product.categoryId,
    )[0].name;
    return prod;
  }

  async updateProduct(id: number): Promise<ReadProductEntity> {
    const product = this.prisma.book.findUnique({ where: { id } });
    return plainToClass(ReadProductEntity, product);
  }

  async deleteProduct(id: number): Promise<ReadProductEntity> {
    const product = this.prisma.book.findUnique({ where: { id } });
    return plainToClass(ReadProductEntity, product);
  }

  async likeBook(userId: string, productId: number): Promise<any> {
    const book = await this.prisma.book.findUnique({
      where: {
        id: Number(productId),
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
        id: Number(productId),
      },
      data: {
        favourites: {
          push: Number(userId),
        },
      },
    });
    return updatedBook;
  }

  async unlikeBook(userId: string, productId: number): Promise<any> {
    const book = await this.prisma.book.findUnique({
      where: {
        id: Number(productId),
      },
    });

    if (!book) {
      throw new NotFoundException();
    }

    const alreadyLiked = book.favourites.includes(Number(userId));

    if (alreadyLiked) {
      const newFavArray = book.favourites.filter(
        (fav) => fav != Number(userId),
      );

      const updatedBook = await this.prisma.book.update({
        where: {
          id: Number(productId),
        },
        data: {
          favourites: newFavArray,
        },
      });
      return updatedBook;
    }
    return book;
  }
}
