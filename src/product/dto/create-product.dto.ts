import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsObject,
  IsArray,
} from 'class-validator';

// MemoryCapacity uchun enum yaratamiz
export enum MemoryCapacityEnum {
  GB_64 = '64GB',
  GB_128 = '128GB',
  GB_256 = '256GB',
  GB_512 = '512GB',
}

export class ProductCreateDto {
  @ApiProperty({ example: "Galaxy S21" })
  @IsString()
  @IsNotEmpty()
  modelName: string;

  @ApiProperty({ example: "Samsung Galaxy S21 Ultra" })
  @IsString()
  @IsNotEmpty()
  productTitle: string;

  @ApiProperty({ example: "Flagship Samsung smartphone with powerful features." })
  @IsString()
  @IsNotEmpty()
  productDescription: string;

  @ApiProperty({ enum: MemoryCapacityEnum, required: false })
  @IsOptional()
  @IsEnum(MemoryCapacityEnum)
  memoryCapacity?: MemoryCapacityEnum;

  @ApiProperty({ example: "Phantom Black", required: false })
  @IsOptional()
  @IsString()
  colorTone?: string;

  @ApiProperty({ example: "Exynos 2100", required: false })
  @IsOptional()
  @IsString()
  cpuModel?: string;

  @ApiProperty({ example: "6.8 inches", required: false })
  @IsOptional()
  @IsString()
  displaySize?: string;

  @ApiProperty({ example: "5000 mAh", required: false })
  @IsOptional()
  @IsString()
  batteryCapacity?: string;

  @ApiProperty({ example: "40MP", required: false })
  @IsOptional()
  @IsString()
  frontCam?: string;

  @ApiProperty({ example: "108MP", required: false })
  @IsOptional()
  @IsString()
  mainCam?: string;

  @ApiProperty({ example: 1199.99 })
  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @ApiProperty({ example: "electronics-category-id" })
  @IsNotEmpty()
  @IsString()
  categoryRef: string;

  @ApiProperty({
    example: {
      iso: "50–102400",
      zoom: "100x digital",
      waterproof: false,
    },
    required: false,
    description: "Extra details for special product types"
  })
  @IsOptional()
  @IsObject()
  additionalSpecs?: Record<string, any>;

  @ApiProperty({ type: [String], example: ["https://example.com/photos/galaxy1.jpg", "https://example.com/photos/galaxy2.jpg"] })
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
