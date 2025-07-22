import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Mahsulot juda sifatli ekan!', description: 'Kommentariyaning matni' })
  @IsNotEmpty({ message: 'Kommentariya matni bo‘sh bo‘lishi mumkin emas' })
  text: string;

  @ApiProperty({ example: '6f78b26a-7d19-4e09-b99e-123456abcdef', description: 'Mahsulot UUIDsi' })
  @IsUUID(undefined, { message: 'productId noto‘g‘ri UUID formatda' })
  productId: string;

  @ApiProperty({ example: '31c2f7a2-aee5-4cf0-83a7-abcdef123456', description: 'Foydalanuvchi UUIDsi' })
  @IsUUID(undefined, { message: 'userId noto‘g‘ri UUID formatda' })
  userId: string;
}
