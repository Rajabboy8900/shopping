import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Put,
    Delete,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    Query,
  } from '@nestjs/common';
  import { ProductService } from './product.service';
  import { ProductCreateDto } from './dto/create-product.dto';
  import { UpdateProductDto } from './dto/update-product.dto';
  import { FilesInterceptor } from '@nestjs/platform-express';
  import { AuthGuard } from '@nestjs/passport';
  import{AccessTokenStrategy} from '../auth/strategies/jwt.strategy'
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/auth/role.enum';
  import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiQuery,
    ApiResponse,
  } from '@nestjs/swagger';
  
  @Controller('api/product')
  export class ProductController {
    constructor(private readonly productService: ProductService) {}
  
    // Create new product
    @Post('create')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @UseInterceptors(FilesInterceptor('image', 5))
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Yangi mahsulot qo‘shish (faqat adminlar)' })
    @ApiResponse({ status: 201, description: 'Mahsulot muvaffaqiyatli yaratildi' })
    @ApiResponse({ status: 400, description: 'Yaroqsiz so‘rov maʼlumotlari' })
    @ApiResponse({ status: 404, description: 'Kategoriya topilmadi' })
    @ApiResponse({ status: 409, description: 'Bu model allaqachon mavjud' })
    @ApiResponse({ status: 500, description: 'Serverda ichki xatolik' })
    async create(
      @Body() dto: ProductCreateDto,
      @UploadedFiles() files: Express.Multer.File[],
    ) {
      return this.productService.createProduct(dto, files);
    }
  
    // Get all products
    @Get('all')
    @ApiOperation({ summary: 'Barcha mahsulotlarni ro‘yxatini olish' })
    @ApiResponse({ status: 200, description: 'Mahsulotlar ro‘yxati' })
    @ApiResponse({ status: 500, description: 'Serverda muammo' })
    async getAll() {
      return this.productService.findAllproducts();
    }
  
    // Get product by ID
    @Get(':id/find')
    @ApiOperation({ summary: 'ID orqali mahsulotni qidirish' })
    @ApiResponse({ status: 200, description: 'Mahsulot topildi' })
    @ApiResponse({ status: 404, description: 'Mahsulot mavjud emas' })
    async getById(@Param('id') id: string) {
      return this.productService.findOneproduct(id);
    }
  
    // Update product
    @Put(':id/update')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @UseInterceptors(FilesInterceptor('image', 5))
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Mahsulotni tahrirlash (adminlar uchun)' })
    @ApiBody({
      type: UpdateProductDto,
      description: 'Yangilanadigan mahsulot maʼlumotlari',
    })
    @ApiResponse({ status: 200, description: 'Mahsulot yangilandi' })
    @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
    @ApiResponse({ status: 400, description: 'Noto‘g‘ri maʼlumot' })
    async update(
      @Param('id') id: string,
      @Body() dto: UpdateProductDto,
      @UploadedFiles() files: Express.Multer.File[],
    ) {
      return this.productService.updateproduct(id, dto, files);
    }
  
    // Delete product
    @Delete(':id/delete')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Mahsulotni o‘chirish (adminlar)' })
    @ApiResponse({ status: 200, description: 'Mahsulot o‘chirildi' })
    @ApiResponse({ status: 404, description: 'Topilmadi' })
    @ApiResponse({ status: 401, description: 'Ruxsat yo‘q' })
    async delete(@Param('id') id: string) {
      return this.productService.removeproduct(id);
    }
  
    // Search products
    @Get('search')
    @ApiOperation({ summary: 'Mahsulotlarni qidirish' })
    @ApiQuery({
      name: 'q',
      required: true,
      example: 'samsung',
      description: 'Qidiruv uchun kalit so‘z',
    })
    async search(@Query('q') keyword: string) {
      return this.productService.searchProducts(keyword);
    }
  }
  