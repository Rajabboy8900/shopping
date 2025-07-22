import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './entities/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { UpdateAuthRoleDto } from './dto/change-user-role.dto';
import { SendResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/recover-password.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { ApiProperty } from '@nestjs/swagger';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAccount)
    private userRepo: Repository<UserAccount>,
    private jwtService: JwtService,
  ) {}

  @ApiProperty({
    description: 'Yangi foydalanuvchini ro‘yxatdan o‘tkazish',
    type: () => ({ message: String }),
    example: { message: 'Tasdiqlash kodi emailingizga yuborildi!' },
  })
  async register(dto: CreateAuthDto) {
    const existing = await this.userRepo.findOne({ where: { emailAddress: dto.email } });
    if (existing) throw new ConflictException('Bu email allaqachon ro‘yxatda bor');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const code = this.generateOtp();

    const user = this.userRepo.create({
      emailAddress: dto.email,
      hashedPassword,
      verificationCode: code,
      codeGeneratedAt: new Date(),
    });

    await this.userRepo.save(user);

    // send code via email — simulate
    console.log(`Yuborilgan tasdiqlash kodi: ${code}`);
    return { message: 'Tasdiqlash kodi emailingizga yuborildi!' };
  }

  @ApiProperty({
    description: 'OTP kod orqali emailni tasdiqlash',
    type: () => ({ message: String }),
    example: { message: 'Email tasdiqlandi!' },
  })
  async verifyOtp(email: string, code: string) {
    const user = await this.userRepo.findOne({ where: { emailAddress: email } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    if (user.verificationCode !== code) throw new ConflictException('Kod noto‘g‘ri');

    user.verified = true;
    user.verificationCode = null;
    await this.userRepo.save(user);
    return { message: 'Email tasdiqlandi!' };
  }

  @ApiProperty({
    description: 'Foydalanuvchi tizimga kirishi',
    type: () => ({ access_token: String }),
    example: { access_token: 'jwt.token.here' },
  })
  async login(dto: CreateAuthDto, res: Response) {
    const user = await this.userRepo.findOne({ where: { emailAddress: dto.email } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const passwordMatch = await bcrypt.compare(dto.password, user.hashedPassword);
    if (!passwordMatch) throw new UnauthorizedException('Email yoki parol noto‘g‘ri');

    const payload = { id: user.id, email: user.emailAddress, role: user.accessLevel };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    });

    return { access_token: accessToken };
  }

  @ApiProperty({
    description: 'Access token yangilash',
    type: () => ({ access_token: String }),
    example: { access_token: 'new.jwt.token.here' },
  })
  async refreshToken(req: Request) {
    const token = req.cookies?.refresh_token;
    if (!token) throw new UnauthorizedException('Token topilmadi');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const newAccessToken = await this.jwtService.signAsync(
        {
          id: payload.id,
          email: payload.email,
          role: payload.role,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      );

      return { access_token: newAccessToken };
    } catch (err) {
      throw new ForbiddenException('Yaroqsiz token');
    }
  }

  @ApiProperty({
    description: 'Barcha foydalanuvchilar ro‘yxati',
    type: () => [UserAccount],
  })
  async getAllUsers() {
    return this.userRepo.find();
  }

  @ApiProperty({
    description: 'Foydalanuvchi rolini yangilash',
    type: () => ({ message: String }),
    example: { message: 'Rol yangilandi' },
  })
  async updateUserRole(id: string, dto: UpdateAuthRoleDto) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    user.accessLevel = dto.role;
    await this.userRepo.save(user);

    return { message: 'Rol yangilandi' };
  }

  @ApiProperty({
    description: 'Parol tiklash uchun kod yuborish',
    type: () => ({ message: String }),
    example: { message: 'Kod yuborildi' },
  })
  async sendResetCode(dto: SendResetDto) {
    const user = await this.userRepo.findOne({ where: { emailAddress: dto.email } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const code = this.generateOtp();
    user.verificationCode = code;
    user.codeGeneratedAt = new Date();
    await this.userRepo.save(user);

    console.log(`Parol tiklash kodi: ${code}`);
    return { message: 'Kod yuborildi' };
  }

  @ApiProperty({
    description: 'Parolni tiklash',
    type: () => ({ message: String }),
    example: { message: 'Parol muvaffaqiyatli tiklandi' },
  })
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userRepo.findOne({ where: { emailAddress: dto.email } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    if (user.verificationCode !== dto.otp) throw new UnauthorizedException('Kod noto‘g‘ri');

    user.hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.verificationCode = null;
    await this.userRepo.save(user);

    return { message: 'Parol muvaffaqiyatli tiklandi' };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}