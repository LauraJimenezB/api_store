import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { AttachmentsService } from '../attachments/services/attachments.service';
import { PrismaService } from '../common/services/prisma.service';
import { AttachmentsModule } from '../attachments/attachments.module';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CartQuantityDto } from './dto/cart-quantity.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ShowCartItemDto } from './dto/showcart-item.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

describe('ProductsproductsService', () => {
  let prismaService: PrismaService;
  let productsService: ProductsService;
  let attachmentsService: AttachmentsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaService, AttachmentsModule],
      providers: [ProductsService, PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    attachmentsService = module.get<AttachmentsService>(AttachmentsService);
    productsService = new ProductsService(prismaService, attachmentsService);

    const prisma = new PrismaClient();
    //create user
    await prisma.user.createMany({
      data: [
        {
          email: 'ana@store.com',
          username: 'azevallos',
          fullName: 'Ana Zeballos',
          password: 'contrasena123',
          emailVerified: true,
          hashActivation: 'caracteresaleatorios1',
        },
      ],
    });
    //create roles
    await prisma.role.createMany({
      data: [{ name: 'CLIENT' }, { name: 'MANAGER' }],
    });
    // create userRole
    await prisma.userRole.createMany({
      data: [{ userId: 1, roleId: 1 }],
    });
    //create categories
    await prisma.category.createMany({
      data: [{ name: 'novel' }, { name: 'fantasy' }],
    });
    //create books
    await prisma.book.createMany({
      data: [
        {
          name: 'Don Quijote de La Mancha I',
          authors: ['Miguel de Cervantes'],
          editorial: 'Anaya',
          price: 125.5,
          stock: 12,
          categoryId: 1,
        },
        {
          name: 'El principito',
          authors: ['Antoine Saint-Exupery'],
          editorial: 'Andina',
          price: 14.0,
          stock: 8,
          categoryId: 2,
        },
        {
          name: 'El extrajero',
          authors: ['Albert Camus'],
          editorial: 'Editimo',
          price: 19.5,
          stock: 3,
          categoryId: 1,
        },
      ],
    });
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  describe('show books', () => {
    it('should return the books', async () => {
      const paginator = new PaginationQueryDto();
      const allBooks = await productsService.getAll(paginator);
      expect(allBooks).toBeTruthy();
      expect(allBooks).toHaveLength(3);
    });
  });

  describe('show one book', () => {
    it('should return one book', async () => {
      const book = await productsService.get(1);
      expect(book).toHaveProperty('editorial');
    });
    it('should return a notfound exception if id does not exist', async () => {
      await expect(productsService.get(-1)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('create a book', () => {
    it('should return a type error if we dont pass any content', async () => {
      const createBookDto = new CreateProductDto();
      await expect(productsService.create(createBookDto)).rejects.toThrowError(
        TypeError,
      );
    });
    const createBookDto: CreateProductDto = {
      name: 'Suma Teologica',
      authors: ['Santo Tomas de Aquino'],
      editorial: 'BAC',
      price: 55,
      stock: 30,
      disabled: false,
      category: 'Religion',
    };
    it('should create a book', async () => {
      const book = await productsService.create(createBookDto);
      expect(book).toHaveProperty('name', 'Suma Teologica');
    });
  });

  describe('update a book', () => {
    it('should return a notfound exception if id does not exist', async () => {
      const updateBookDto = new UpdateProductDto();
      await expect(
        productsService.update(-1, updateBookDto),
      ).rejects.toThrowError(NotFoundException);
    });
    const updateBookDto: UpdateProductDto = {
      name: 'Suma Teologica',
      authors: ['Santo Tomas de Aquino'],
      editorial: 'Autores Cristianos',
      price: 55,
      stock: 30,
      category: 'Religion',
    };
    it('should update a book', async () => {
      const book = await productsService.update(1, updateBookDto);
      expect(book).toHaveProperty('editorial', 'Autores Cristianos');
    });
  });

  describe('show delete one book', () => {
    it('should return a notfound exception if id does not exist', async () => {
      await expect(productsService.get(-1)).rejects.toThrowError(
        NotFoundException,
      );
    });
    it('should delete one book', async () => {
      const book = await productsService.delete(1);
      expect(book).toBeTruthy();
    });
  });

  describe('show books by category', () => {
    it('should return the books', async () => {
      const category = 'Fantasy';
      const allBooks = await productsService.getByCategory(category);
      expect(allBooks).toHaveLength(1);
    });
    it('should return a notfound exception if the category does not exist', async () => {
      await expect(productsService.getByCategory('')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('show disable a book', () => {
    it('should return a notfound exception if id does not exist', async () => {
      await expect(productsService.disable(-1)).rejects.toThrowError(
        NotFoundException,
      );
    });
    it('should disable a book', async () => {
      const book = await productsService.disable(2);
      expect(book).toHaveProperty('disabled', true);
    });
  });

  describe('show enable a book', () => {
    it('should return a notfound exception if id does not exist', async () => {
      await expect(productsService.enable(-1)).rejects.toThrowError(
        NotFoundException,
      );
    });
    it('should enable a book', async () => {
      const book = await productsService.enable(2);
      expect(book).toHaveProperty('disabled', false);
    });
  });

  describe('show add book to cart', () => {
    it('should return a not acceptable exception if quantity less that 1', async () => {
      const quantityDto: CartQuantityDto = { quantity: 0 };
      await expect(
        productsService.addToCart(1, 2, quantityDto),
      ).rejects.toThrowError(NotAcceptableException);
    });

    it('should return a notfound exception if id does not exist', async () => {
      const quantityDto: CartQuantityDto = { quantity: 1 };
      await expect(
        productsService.addToCart(1, -1, quantityDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should return a not acceptable exception if quantity is greater that stock', async () => {
      const quantityDto: CartQuantityDto = { quantity: 99999 };
      await expect(
        productsService.addToCart(1, 2, quantityDto),
      ).rejects.toThrowError(NotAcceptableException);
    });
    it('should return the cart with the stock', async () => {
      const quantityDto: CartQuantityDto = { quantity: 2 };
      const cartItem = await productsService.addToCart(1, 2, quantityDto);
      expect(cartItem).toBeInstanceOf(ShowCartItemDto);
    });
  });

  afterAll(async () => {
    await prismaService.clearDatabase();
    await prismaService.$disconnect();
  });
});
