import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ApiBearerAuth, ApiSecurity, ApiProperty } from '@nestjs/swagger';

@Injectable()
@ApiBearerAuth()
@ApiSecurity('JWT-auth')
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (!accessSecret) {
      throw new UnauthorizedException('JWT access token siri aniqlanmagan');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: accessSecret,
      ignoreExpiration: false,
    });
  }

  @ApiProperty({
    description: 'JWT token validatsiya qilish',
    type: 'object',
    properties: {
      userId: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
      emailAddress: { type: 'string', format: 'email', example: 'user@example.com' },
      userRole: { type: 'string', enum: ['USER', 'ADMIN', 'MODERATOR'], example: 'USER' },
    },
  })
  async validate(payload: { id: string; email: string; role: string }) {
    return {
      userId: payload.id,
      emailAddress: payload.email,
      userRole: payload.role,
    };
  }
}