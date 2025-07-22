import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmOtpDto {
  @ApiProperty({
    example: "user@gmail.com",
    description: "Foydalanuvchi elektron pochta manzili",
    format: 'email',
    required: true
  })
  @IsEmail({}, { message: "Noto'g'ri elektron pochta formati" })
  @IsNotEmpty({ message: "Elektron pochta maydoni bo'sh bo'lishi mumkin emas" })
  email: string;

  @ApiProperty({
    example: "123456",
    description: "Tasdiqlash kodi (OTP)",
    minLength: 4,
    maxLength: 8,
    required: true
  })
  @IsString({ message: "OTP kod satr bo'lishi kerak" })
  @IsNotEmpty({ message: "OTP maydoni bo'sh bo'lishi mumkin emas" })
  @Length(4, 8, { message: "OTP kod 4 dan 8 gacha belgidan iborat bo'lishi kerak" })
  otp: string;
}