import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from './entities/auth.entity';
import { EmailModule } from 'src/email/email.module';
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(), // Konfiguratsiya uchun
    ThrottlerModule.forRoot([{ // Brute force hujumlardan himoya qilish
      ttl: 60, // 1 daqiqa
      limit: 10, // Har 1 daqiqada 10 ta so'rov
    }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES', '15m') 
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserAccount]), 
    EmailModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    AccessTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Barcha endpointlarga rate limit qo'llash
    },
  ],
})
export class AuthModule {}