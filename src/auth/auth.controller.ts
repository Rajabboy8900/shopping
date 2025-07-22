import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiCookieAuth,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { SendResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/recover-password.dto';
import { UpdateAuthRoleDto } from './dto/change-user-role.dto';

import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from './role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('Autentifikatsiya')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Foydalanuvchini ro‘yxatdan o‘tkazish',
    description: 'Yangi foydalanuvchi registratsiyasi uchun endpoint'
  })
  @ApiBody({ type: CreateAuthDto })
  @ApiCreatedResponse({ 
    description: 'Foydalanuvchi muvaffaqiyatli yaratildi',
    schema: {
      example: { message: 'Tasdiqlash kodi emailingizga yuborildi!' }
    }
  })
  @ApiConflictResponse({ 
    description: 'Email allaqachon ro‘yxatda bor' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Noto‘g‘ri so‘rov formati' 
  })
  async register(@Body() dto: CreateAuthDto) {
    await this.authService.register(dto);
    return { message: 'Tasdiqlash kodi emailingizga yuborildi!' };
  }

  @Post('verify_otp')
  @ApiOperation({ 
    summary: 'OTP orqali emailni tasdiqlash',
    description: 'Elektron pochta manzilini tasdiqlash uchun OTP kodini tekshirish'
  })
  @ApiBody({ type: ConfirmOtpDto })
  @ApiOkResponse({ 
    description: 'Email muvaffaqiyatli tasdiqlandi',
    schema: {
      example: { message: 'Email tasdiqlandi!' }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Noto‘g‘ri yoki eskirgan OTP kodi' 
  })
  @ApiNotFoundResponse({ 
    description: 'Elektron pochta manzili topilmadi' 
  })
  async verifyOtp(@Body() dto: ConfirmOtpDto) {
    await this.authService.verifyOtp(dto.otp, dto.email);
    return { message: 'Email tasdiqlandi!' };
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Tizimga kirish',
    description: 'Foydalanuvchi hisobiga kirish uchun endpoint'
  })
  @ApiBody({ type: CreateAuthDto })
  @ApiOkResponse({ 
    description: 'Kirish muvaffaqiyatli',
    schema: {
      example: { 
        accessToken: 'jwt.token.here',
        refreshToken: 'refresh.token.here' 
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Foydalanuvchi topilmadi' })
  @ApiUnauthorizedResponse({ description: 'Email yoki parol noto‘g‘ri' })
  async login(
    @Body() dto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @Post('refresh')
  @ApiOperation({ 
    summary: 'Tokenni yangilash',
    description: 'Access token yangilash uchun endpoint'
  })
  @ApiCookieAuth('refresh_token')
  @ApiOkResponse({ 
    description: 'Yangi access token',
    schema: {
      example: { accessToken: 'new.jwt.token.here' }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Yaroqsiz refresh token' })
  async refresh(@Req() req: Request) {
    return this.authService.refreshToken(req);
  }

  @Post('logout')
  @ApiOperation({ 
    summary: 'Tizimdan chiqish',
    description: 'Foydalanuvchi sessiyasini tugatish'
  })
  @ApiOkResponse({ 
    description: 'Tizimdan chiqish muvaffaqiyatli',
    schema: {
      example: { message: 'Tizimdan chiqdingiz' }
    }
  })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    });
    return { message: 'Tizimdan chiqdingiz' };
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Barcha foydalanuvchilarni olish',
    description: 'Faqat SUPERADMIN rolidagi foydalanuvchilar uchun'
  })
  @ApiOkResponse({ 
    description: 'Foydalanuvchilar ro‘yxati',
    type: [UpdateAuthRoleDto] // UserAccount entitysi import qilinishi kerak
  })
  @ApiUnauthorizedResponse({ description: 'Ruxsat etilmagan' })
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Put(':id/role')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Foydalanuvchining rolini yangilash',
    description: 'Foydalanuvchi rolini o‘zgartirish (faqat SUPERADMIN)'
  })
  @ApiParam({
    name: 'id',
    description: 'Foydalanuvchi IDsi (UUID formatida)',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @ApiBody({ type: UpdateAuthRoleDto })
  @ApiOkResponse({ 
    description: 'Rol muvaffaqiyatli o‘zgartirildi',
    type: UpdateAuthRoleDto // UserAccount entitysi import qilinishi kerak
  })
  @ApiNotFoundResponse({ description: 'Foydalanuvchi topilmadi' })
  @ApiUnauthorizedResponse({ description: 'Ruxsat etilmagan' })
  async updateUserRole(
    @Param('id') id: string,
    @Body() dto: UpdateAuthRoleDto,
  ) {
    return this.authService.updateUserRole(id, dto);
  }

  @Post('forgot_password')
  @ApiOperation({ 
    summary: 'Parol tiklash uchun kod yuborish',
    description: 'Elektron pochta orqali parolni tiklash kodi yuborish'
  })
  @ApiBody({ type: SendResetDto })
  @ApiOkResponse({ 
    description: 'Parol tiklash kodi yuborildi',
    schema: {
      example: { message: 'Parol tiklash kodi emailingizga yuborildi' }
    }
  })
  @ApiNotFoundResponse({ description: 'Elektron pochta manzili topilmadi' })
  async sendResetCode(@Body() dto: SendResetDto) {
    return this.authService.sendResetCode(dto);
  }

  @Post('reset_password')
  @ApiOperation({ 
    summary: 'Parolni tiklash',
    description: 'OTP kod yordamida yangi parol o‘rnatish'
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({ 
    description: 'Parol muvaffaqiyatli o‘zgartirildi',
    schema: {
      example: { message: 'Parolingiz muvaffaqiyatli o‘zgartirildi    ' }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Noto‘g‘ri OTP kodi' })
  @ApiNotFoundResponse({ description: 'Elektron pochta manzili topilmadi' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}