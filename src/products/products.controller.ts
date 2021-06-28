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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CartQuantityDto } from './dto/cart-quantity.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Roles } from 'src/users/roles/role.decorator';

@ApiTags('books')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getBooks(@Query() paginationQueryDto: PaginationQueryDto) {
    return await this.productsService.getAll(paginationQueryDto);
  }

  @Get(':id')
  getBook(@Param('id') id: number) {
    return this.productsService.get(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  create(@Body() productDto: CreateProductDto) {
    return this.productsService.create(productDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  updateBook(@Param('id') id: number, @Body() productDto: UpdateProductDto) {
    return this.productsService.update(id, productDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  removeBook(@Param('id') id: number) {
    return this.productsService.delete(id);
  }

  @Get('category/:name')
  getByCategory(@Param('name') categoryName: string) {
    console.log('cateeeee');
    return this.productsService.getByCategory(categoryName);
  }

  @Post(':id/disable')
  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  disableBook(@Param('id') bookId: number) {
    return this.productsService.disable(bookId);
  }

  @Post(':id/enable')
  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  enableBook(@Param('id') bookId: number) {
    return this.productsService.enable(bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
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
  addToCart(
    @Request() req,
    @Param('id') bookId: number,
    @Body() body: CartQuantityDto,
  ) {
    return this.productsService.addToCart(req.user.id, bookId, body);
  }

  @Post(':id/uploadImage')
  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
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

  @Get(':id/getImages')
  @UseGuards(JwtAuthGuard)
  async getAllPrivateFiles(@Param('id') bookId: number) {
    return this.productsService.getImagesByProduct(bookId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file.originalname);
  }
}
