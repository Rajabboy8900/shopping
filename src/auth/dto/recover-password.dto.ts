import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';
import { Length } from 'class-validator'; // Length ni alohida import qilish

export class ResetPasswordDto {
  @ApiProperty({
    example: "foydalanuvchi@gmail.com",
    description: "Foydalanuvchining ro'yxatdan o'tgan elektron pochta manzili",
    format: "email",
    required: true,
    maxLength: 255
  })
  @IsEmail({}, { message: "Iltimos, to'g'ri elektron pochta manzilini kiriting" })
  @IsNotEmpty({ message: "Elektron pochta maydoni bo'sh bo'lishi mumkin emas" })
  email: string;

  @ApiProperty({
    example: "489235",
    description: "Elektron pochta orqali yuborilgan bir martalik kod (OTP)",
    minLength: 6,
    maxLength: 6,
    required: true
  })
  @IsString({ message: "OTP kod matn ko'rinishida bo'lishi kerak" })
  @IsNotEmpty({ message: "OTP maydoni bo'sh bo'lishi mumkin emas" })
  @Length(6, 6, { message: "OTP kod aniq 6 ta raqamdan iborat bo'lishi kerak" })
  otp: string;

  @ApiProperty({
    example: "YangiParol123!",
    description: "Yangi parol (kamida 8 ta belgi, 1 ta katta harf, 1 ta kichik harf va 1 ta raqam)",
    minLength: 8,
    maxLength: 32,
    required: true,
    format: "password"
  })
  @IsString({ message: "Parol matn ko'rinishida bo'lishi kerak" })
  @IsNotEmpty({ message: "Parol maydoni bo'sh bo'lishi mumkin emas" })
  @MinLength(8, { message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" })
  @MaxLength(32, { message: "Parol 32 ta belgidan uzun bo'lmasligi kerak" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    {
      message: "Parol kamida 1 ta katta harf, 1 ta kichik harf va 1 ta raqamdan iborat bo'lishi kerak"
    }
  )
  newPassword: string;
}