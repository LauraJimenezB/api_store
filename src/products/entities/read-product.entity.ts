import { Decimal } from '@prisma/client/runtime';

export class ReadProductEntity {
  name: string;
  authors: string[];
  editorial: string;
  price: number;
  stock: number;
  categoryName: string;
  favourites: number;
}
