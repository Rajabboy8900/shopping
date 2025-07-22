import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendResetDto {
  @ApiProperty({
    example: "user@gmail.com",
    description: "Parolni  tiklash uchun elektron pochta manzili",
    format: "email",
    required: true,
    maxLength: 255,
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
  })
  @IsEmail({}, { message: "Iltimos, to'g'ri elektron pochta manzilini kiriting" })
  @IsNotEmpty({ message: "Elektron pochta maydoni bo'sh bo'lishi mumkin emas" })
  email: string;
}