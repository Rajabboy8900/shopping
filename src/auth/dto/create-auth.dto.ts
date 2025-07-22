import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Foydalanuvchining elektron pochta manzili',
    format: 'email',
    required: true,
    maxLength: 255,
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
  })
  @IsEmail({}, { message: "Iltimos, to‘g‘ri email manzilini kiriting!" })
  @IsNotEmpty({ message: "Email maydoni bo‘sh bo‘lishi mumkin emas!" })
  @IsString({ message: "Email matn formatida bo‘lishi kerak!" })
  @MaxLength(255, { message: "Email 255 ta belgidan uzun bo‘lmasligi kerak!" })
  email: string;

  @ApiProperty({
    example: 'MySecurePassword123!',
    description: 'Kirish uchun parol (kamida 8 ta belgi, 1 ta katta harf, 1 ta kichik harf, 1 ta raqam va 1 ta maxsus belgi)',
    minLength: 8,
    maxLength: 64,
    required: true,
    format: 'password'
  })
  @IsString({ message: "Parol matn formatida bo‘lishi kerak!" })
  @IsNotEmpty({ message: "Parol maydoni bo‘sh bo‘lishi mumkin emas!" })
  @MinLength(8, { message: "Parol kamida 8 ta belgidan iborat bo‘lishi kerak!" })
  @MaxLength(64, { message: "Parol 64 ta belgidan uzun bo‘lmasligi kerak!" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Parol kamida 1 ta katta harf, 1 ta kichik harf, 1 ta raqam va 1 ta maxsus belgi (@$!%*?&) dan iborat bo‘lishi kerak!",
    }
  )
  password: string;
}