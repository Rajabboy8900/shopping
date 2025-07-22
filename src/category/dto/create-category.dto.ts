import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Kategoriya nomi',
    example: 'Smartfonlar',
  })
  @IsString({ message: 'Kategoriya nomi matn ko‘rinishida bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Kategoriya nomi bo‘sh bo‘lishi mumkin emas' })
  name: string;
}
