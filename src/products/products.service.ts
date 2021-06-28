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
import { CartQuantityDto } from './dto/cart-quantity.dto';
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
      include: {
        category: true,
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
      include: {
        category: true,
      },
    });
    if (!book) {
      throw new NotFoundException();
    }
    const product = plainToClass(ReadProductEntity, book);
    product.favourites = book.favourites.length;
    product.categoryName = book.category.name;
    return product;
  }

  async create(createDto: CreateProductDto): Promise<ReadProductEntity> {
    const category = await this.preloadCategoryByName(
      createDto.category.toLowerCase(),
    );
    const book = await this.prisma.book.create({
      data: {
        name: createDto.name,
        authors: createDto.authors,
        editorial: createDto.editorial,
        price: createDto.price,
        stock: createDto.stock,
        categoryId: category.id,
      },
      include: {
        category: true,
      },
    });
    const product = plainToClass(ReadProductEntity, book);
    product.favourites = book.favourites.length;
    product.categoryName = book.category.name;
    return product;
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
      include: {
        category: true,
      },
    });
    const product = plainToClass(ReadProductEntity, updatedBook);
    product.favourites = updatedBook.favourites.length;
    product.categoryName = updatedBook.category.name;
    return product;
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

    if (!category) {
      throw new NotFoundException();
    }

    const books = await this.prisma.book.findMany({
      where: { categoryId: category.id },
    });
    const prods = books.map((prod) => {
      const prodToReturn = {
        ...prod,
        favourites: prod.favourites.length,
        categoryName: category.name,
      };
      return prodToReturn;
    });
    return plainToClass(ReadProductEntity, prods);
  }

  async disable(id: number): Promise<ReadProductEntity> {
    const book = await this.prisma.book.findUnique({
      where: { id: id },
    });
    if (!book) {
      throw new NotFoundException();
    }
    const updatedBook = await this.prisma.book.update({
      where: {
        id: id,
      },
      data: {
        disabled: true,
      },
      include: { category: true },
    });
    const product = plainToClass(ReadProductEntity, updatedBook);
    product.favourites = updatedBook.favourites.length;
    product.categoryName = updatedBook.category.name;
    return product;
  }

  async enable(id: number): Promise<ReadProductEntity> {
    const book = await this.prisma.book.findUnique({
      where: { id: id },
    });
    if (!book) {
      throw new NotFoundException();
    }
    const updatedBook = await this.prisma.book.update({
      where: {
        id: id,
      },
      data: {
        disabled: false,
      },
      include: { category: true },
    });
    const product = plainToClass(ReadProductEntity, updatedBook);
    product.favourites = updatedBook.favourites.length;
    product.categoryName = updatedBook.category.name;
    return product;
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
      include: {
        category: true,
      },
    });

    if (!book) {
      throw new NotFoundException();
    }

    const alreadyLiked = book.favourites.includes(Number(userId));

    if (alreadyLiked) {
      const product = plainToClass(ReadProductEntity, book);
      product.favourites = book.favourites.length;
      product.categoryName = book.category.name;
      return product;
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
      include: {
        category: true,
      },
    });
    const prodUpdated = plainToClass(ReadProductEntity, updatedBook);
    prodUpdated.favourites = updatedBook.favourites.length;
    prodUpdated.categoryName = updatedBook.category.name;
    return prodUpdated;
  }

  async unlike(userId: number, productId: number): Promise<any> {
    const book = await this.prisma.book.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
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
        include: {
          category: true,
        },
      });
      const product = plainToClass(ReadProductEntity, updatedBook);
      product.favourites = updatedBook.favourites.length;
      product.categoryName = updatedBook.category.name;
      return product;
    }
    const product = plainToClass(ReadProductEntity, book);
    product.favourites = book.favourites.length;
    product.categoryName = book.category.name;
    return product;
  }

  async addToCart(
    userId: number,
    productId: number,
    cartQuantityDto: CartQuantityDto,
  ): Promise<ShowCartItemDto> {
    if (cartQuantityDto.quantity <= 0) {
      throw new NotAcceptableException('The quantity must be greater than 0');
    }
    const book = await this.prisma.book.findUnique({
      where: {
        id: productId,
      },
    });
    if (!book) {
      throw new NotFoundException();
    }
    if (book.stock < cartQuantityDto.quantity) {
      throw new NotAcceptableException(
        'The quantity is greater that the stock available',
      );
    }
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
          quantity: cartQuantityDto.quantity,
        },
      });
    } else {
      await this.prisma.cart.update({
        where: {
          id: getAlreadyInCart.id,
        },
        data: {
          quantity: cartQuantityDto.quantity,
        },
      });
    }
    const cartItem = plainToClass(ShowCartItemDto, {
      title: book.name,
      quantity: cartQuantityDto.quantity,
      price: book.price,
      pricetotal: cartQuantityDto.quantity * book.price,
    });
    return cartItem;
  }

  async addPrivateFile(bookId: number, imageBuffer: Buffer, filename: string) {
    return this.attachmentsService.uploadImages(imageBuffer, bookId, filename);
  }

  async getImagesByProduct(productId: number) {
    const productImages = await this.prisma.attachment.findMany({
      where: {
        bookId: productId,
      },
    });
    if (productImages) {
      return Promise.all(
        productImages.map(async (file) => {
          const url = await this.attachmentsService.generatePresignedUrl(
            file.key,
          );
          return {
            ...file,
            url,
          };
        }),
      );
    }
    throw new NotFoundException('Images with this bookId do not exist');
  }
}
