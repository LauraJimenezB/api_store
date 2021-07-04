import { Exclude } from 'class-transformer';

export class ReadProductImagesDto {
  name: string;
  authors: string[];
  editorial: string;
  price: number;
  stock: number;
  categoryName: string;
  disabled: boolean;
  favourites: number;
  @Exclude()
  categoryId: number;
  @Exclude()
  category;
  imagesUrl: string[];
}
