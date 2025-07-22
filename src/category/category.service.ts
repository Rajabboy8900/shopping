import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { UpdateCategoryDto } from './dto/update-category.dto';
  import { Category } from './entities/category.entity';
  
  @Injectable()
  export class CategoryService {
    constructor(
      @InjectRepository(Category)
      private readonly categoryRepository: Repository<Category>,
    ) {}
  
    async create(dto: CreateCategoryDto) {
      const exists = await this.categoryRepository.findOne({ where: { name: dto.name } });
      if (exists) {
        throw new ConflictException('Ushbu nomdagi kategoriya mavjud!');
      }
  
      const category = this.categoryRepository.create(dto);
      await this.categoryRepository.save(category);
  
      return { message: 'Kategoriya yaratildi!' };
    }
  
    async findAll() {
      const categories = await this.categoryRepository.find();
      if (!categories.length) {
        throw new NotFoundException('Kategoriyalar topilmadi');
      }
      return categories;
    }
  
    async findOne(id: string) {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['product'],
      });
  
      if (!category) {
        throw new NotFoundException(`Kategoriya #${id} topilmadi`);
      }
  
      return category;
    }
  
    async update(id: string, dto: UpdateCategoryDto) {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new NotFoundException(`Kategoriya #${id} topilmadi`);
      }
  
      await this.categoryRepository.update(id, dto);
      return { message: 'Kategoriya  muvaffaqiyatli yangilandi!' };
    }
  




    async remove(id: string) {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new NotFoundException(`Kategoriya #${id} topilmadi`);
      }
  
      await this.categoryRepository.delete(id);
      return { message: 'Kategoriya muvaffaqiyatli o‘chirildi!' };
    }
  }
  