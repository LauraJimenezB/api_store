import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of a book.' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'The authors', type: [String] })
  @IsString({ each: true })
  @IsNotEmpty()
  readonly authors: string[];

  @ApiProperty({ description: 'Editorial' })
  @IsString()
  @IsNotEmpty()
  readonly editorial: string;

  @ApiProperty({ description: 'The price.' })
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @ApiProperty({ description: 'Available stock.' })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({ description: 'The categories that belogns the book' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'If the book is disabled for sale' })
  @IsBoolean()
  disabled: boolean;
}
