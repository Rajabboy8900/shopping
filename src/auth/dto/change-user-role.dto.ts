import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthRoleDto {
  @ApiProperty({
    example: "admin",
    description: "Foydalanuvchi roli",
    enum: Role, // Swagger-ga enum qiymatlarini ko'rsatish
    required: true, // IsOptional bilan mos kelishi uchun
  })
  @IsOptional()
  @IsEnum(Role, { message: "Noto‘g‘ri role qiymati! Iltimos, quyidagilardan birini tanlang: ${Object.values(Role).join(', ')}" })
  role: Role; // IsOptional bilan ishlatilganda type ni optional qilish
}