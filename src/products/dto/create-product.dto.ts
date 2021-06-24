import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of a book.' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The authors', type: [String] })
  @IsString({ each: true })
  readonly authors: string[];

  @ApiProperty({ description: 'Editorial' })
  @IsString()
  readonly editorial: string;

  @ApiProperty({ description: 'The price.' })
  @IsNumber()
  readonly price: number;

  @ApiProperty({ description: 'Available stock.' })
  @IsNumber()
  stock: number;

  @ApiProperty({ description: 'The categories that belogns the book' })
  @IsString()
  category: string;

  @Exclude()
  categoryId: number;
}
