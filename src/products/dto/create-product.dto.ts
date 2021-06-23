import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
  @IsString()
  readonly price: number;

  @ApiProperty({ description: 'Available stock.' })
  @IsString()
  stock: number;

  @ApiProperty({ description: 'The categories that belogns the book' })
  @IsString()
  categoryName: string;
}
