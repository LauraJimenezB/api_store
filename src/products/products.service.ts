import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ReadProductEntity } from './entities/read-product.entity';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(): Promise<ReadProductEntity[]> {
    const categories = await this.prisma.category.findMany();
    const products = await this.prisma.book.findMany();
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

  async getProduct(id: number): Promise<ReadProductEntity> {
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

  async createProduct(createDto: CreateProductDto): Promise<ReadProductEntity> {
    const category = await this.preloadCategoryByName(createDto.categoryName);
    const product = this.prisma.book.create({
      data: {
        name: createDto.name,
        authors: createDto.authors,
        editorial: createDto.editorial,
        price: createDto.price,
        stock: createDto.stock,
        categoryId: category.id,
      },
    });
    return plainToClass(ReadProductEntity, product);
  }

  async updateProduct(id: number): Promise<ReadProductEntity> {
    const product = this.prisma.book.findUnique({ where: { id } });
    return plainToClass(ReadProductEntity, product);
  }

  async deleteProduct(id: number): Promise<ReadProductEntity> {
    const product = this.prisma.book.findUnique({ where: { id } });
    return plainToClass(ReadProductEntity, product);
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
}
