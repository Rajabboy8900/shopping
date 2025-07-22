import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
  } from '@nestjs/common';
  import { CategoryService } from './category.service';
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { UpdateCategoryDto } from './dto/update-category.dto';
  import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/auth/role.enum';
  
  @ApiTags('Categories')
  @Controller('api/category')
  export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
  
    @Post('create')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Yangi kategoriya yaratish (admin/superadmin)' })
    @ApiResponse({ status: 201, description: 'Kategoriya yaratildi' })
    @ApiResponse({ status: 409, description: 'Kategoriya nomi mavjud' })
    create(@Body() dto: CreateCategoryDto) {
      return this.categoryService.create(dto);
    }
  
    @Get('all')
    @ApiOperation({ summary: 'Barcha kategoriyalarni olish' })
    @ApiResponse({ status: 200, description: 'Kategoriya ro‘yxati' })
    findAll() {
      return this.categoryService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Kategoriya ID bo‘yicha olish' })
    @ApiResponse({ status: 200, description: 'Kategoriya topildi' })
    @ApiResponse({ status: 404, description: 'Kategoriya topilmadi' })
    findOne(@Param('id') id: string) {
      return this.categoryService.findOne(id);
    }
  
    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Kategoriya maʼlumotlarini yangilash' })
    @ApiResponse({ status: 200, description: 'Kategoriya yangilandi' })
    @ApiResponse({ status: 404, description: 'Kategoriya topilmadi' })
    update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
      return this.categoryService.update(id, dto);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Kategoriya o‘chirish (admin/superadmin)' })
    @ApiResponse({ status: 200, description: 'Kategoriya o‘chirildi' })
    @ApiResponse({ status: 404, description: 'Kategoriya topilmadi' })
    remove(@Param('id') id: string) {
      return this.categoryService.remove(id);
    }
  }
  