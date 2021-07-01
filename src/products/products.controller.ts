import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CartQuantityDto } from './dto/cart-quantity.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Roles } from '../users/roles/role.decorator';
import { AttachmentsService } from '../attachments/services/attachments.service';

@ApiTags('books')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  @Post(':id/image/upload')
  createAttachment(@Request() req, @Param('id') bookId: number) {
    return this.productsService.uploadImagesToBook(
      bookId,
      req.headers['content-type'],
    );
  }
}
