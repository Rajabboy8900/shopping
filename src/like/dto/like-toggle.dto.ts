import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LikeProductDto {
  @ApiProperty({
    example: 'f3b0c734-4d8d-4c1b-ae2e-2d9b3c1a890d',
    description: 'Like (yoki Unlike) bajarilayotgan mahsulotning UUID identifikatori',
  })
  @IsUUID()
  productId:  string;
}
