import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PrismaService } from '../common/services/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ReadProductEntity } from './entities/read-product.entity';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<ReadProductEntity[]> {
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
    return plainToClass(ReadProductEntity, prods);
  }

  async get(id: number): Promise<ReadProductEntity> {
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
    const category = await this.preloadCategoryByName(updateDto.category);
    await this.prisma.book.update({
      where: {
        id: id,
      },
      data: {
        name: updateDto.name,
        authors: updateDto.authors,
        editorial: updateDto.editorial,
        price: updateDto.price,
        stock: updateDto.stock,
        categoryId: category.id,
      },
    });
    return plainToClass(ReadProductEntity, updateDto);
  }

  async delete(id: number): Promise<ReadProductEntity> {
    const product = await this.prisma.book.delete({
      where: {
        id: id,
      },
    });
    return plainToClass(ReadProductEntity, product);
  }

  async getByCategory(name: string): Promise<any> {
    const category = await this.prisma.category.findFirst({
      where: { name: name.toLowerCase() },
    });
    console.log(category);
    const products = await this.prisma.book.findMany({
      where: { categoryId: category.id },
    });
    const prods = products.map((prod) => {
      return {
        ...prod,
        favourites: prod.favourites.length,
        categoryName: category.name,
      };
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

  async like(userId: string, productId: number): Promise<any> {
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

  async unlike(userId: string, productId: number): Promise<any> {
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
