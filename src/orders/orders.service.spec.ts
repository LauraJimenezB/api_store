import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../common/services/prisma.service';
import { OrdersService } from './orders.service';

describe('UsersService', () => {
  let ordersService: OrdersService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaService],
      providers: [OrdersService, PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);

    ordersService = new OrdersService(prismaService);

    await prismaService.user.create({
      data: {
        id: 1,
        username: 'anaC',
        fullName: 'Ana Castillo',
        email: 'example123@mail.com',
        password: 'pass123',
        hashActivation: '123456',
      },
    });

    await prismaService.category.createMany({
      data: [{ name: 'novel' }, { name: 'fantasy' }],
    });

    await prismaService.book.createMany({
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
      ],
    });

    await prismaService.cart.createMany({
      data: [
        {
          userId: 1,
          bookId: 1,
          quantity: 3,
        },
        {
          userId: 1,
          bookId: 2,
          quantity: 2,
        },
      ],
    });
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
  });

  describe('cart of user', () => {
    it('should return the items added to the cart by a user', async () => {
      const items = await ordersService.showCart(1);
      expect(items.orders).toHaveLength(2);
    });
  });

  describe('show Order of user', () => {
    it('should return no orders', async () => {
      await expect(ordersService.showOrder(1)).rejects.toThrow(
        'No orders found',
      );
    });
  });

  describe('show Order of user', () => {
    it('should send the order', async () => {
      const items = await ordersService.sendOrder(1);
      expect(items.orders).toHaveLength(2);
    });
  });

  describe('show Order of user', () => {
    it('should return the order after buying of a user', async () => {
      const items = await ordersService.showOrder(1);
      expect(items.orders).toHaveLength(2);
    });
    it('should throw an error if the user does not exists', async () => {
      await expect(ordersService.showOrder(6)).rejects.toThrow(
        'User not found',
      );
    });
  });

  afterAll(async () => {
    await prismaService.clearDatabase();
    await prismaService.$disconnect();
  });
});
