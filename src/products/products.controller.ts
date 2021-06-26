import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CreateAttachmentInput } from 'src/attachments/dto/create-attachment-input.dto';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

class SampleDto {
  name: string;
}

@ApiTags('books')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  async getBooks(@Query() paginationQueryDto: PaginationQueryDto) {
    return await this.productsService.getAll(paginationQueryDto);
  }

  @Get(':id')
  getBook(@Param('id') id: number) {
    return this.productsService.get(id);
  }

  @Post()
  create(@Body() productDto: CreateProductDto) {
    return this.productsService.create(productDto);
  }

  @Patch(':id')
  updateBook(@Param('id') id: number, @Body() productDto: UpdateProductDto) {
    return this.productsService.update(id, productDto);
  }

  @Delete(':id')
  removeBook(@Param('id') id: number) {
    return this.productsService.delete(id);
  }

  @Get('category/:name')
  getByCategory(@Param('name') categoryName: string) {
    console.log('cateeeee');
    return this.productsService.getByCategory(categoryName);
  }

  @Post(':id/disable')
  disableBook(@Request() req, @Param('id') bookId: number) {
    return this.productsService.disable(bookId);
  }

  @Post(':id/enable')
  enableBook(@Request() req, @Param('id') bookId: number) {
    return this.productsService.enable(bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  likeBook(@Request() req, @Param('id') bookId: number) {
    return this.productsService.like(req.user.id, bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unlike')
  unlikeBook(@Request() req, @Param('id') bookId: number) {
    return this.productsService.unlike(req.user.id, bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cart')
  addToCart(@Request() req, @Param('id') bookId: number, @Body() body) {
    return this.productsService.addToCart(req.user.id, bookId, body.quantity);
  }

  @Post(':id/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addPrivateFile(
    @Param('id') bookId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    return this.productsService.addPrivateFile(
      bookId,
      file.buffer,
      file.originalname,
    );
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file.originalname);
  }
}
