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
import { AttachmentDto } from '../attachments/dto/attachment.dto';
import { UploadImageDto } from '../attachments/dto/upload-image.dto';
import { CreateAttachmentDto } from '../attachments/dto/create-attachment.dto';

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

  /* @Post(':id/uploadImage')
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
  } */
  /* @Post(':id/image/upload')
  uploadProductImage(
    @Body() params: UploadImageDto,
    @GetUser() user: User,
  ): Promise<PreSignedUrlDto> {
    return this.productsService.addPrivateFile(user.id, params);
  }

  @Get(':id/getImages')
  @UseGuards(JwtAuthGuard)
  async getAllPrivateFiles(@Param('id') bookId: number) {
    return this.productsService.getImagesByProduct(bookId);
  } */

  /* @Post(':id/image/upload')
  createAttachment(
    @Body('type') type: string,
    @Request() req,
    @Param('id') bookId: number,
  ): Promise<{ url: string }> {
    console.log(req)
    return this.attachmentsService.uploadImages(type, bookId);
  } */

  @Post(':id/image/upload')
  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  createAttachment(
    @Body() params: CreateAttachmentDto,
    @Request() req,
    @Param('id') bookId: number,
  ): Promise<AttachmentDto> {
    return this.productsService.uploadImagesToBook(bookId, req.headers['content-type'], params);
  }

  @Get('images/:id')
  getAttachments(@Param('id') bookId: number): Promise<AttachmentDto[]> {
    return this.attachmentsService.getImages(bookId);
  }
}
