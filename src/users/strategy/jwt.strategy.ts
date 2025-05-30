import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: {sub: string, email: string}) {
    const result = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });
    
    if(!result)
        throw new UnauthorizedException('Invalid Token.');
    const { passwordHash, refreshToken, ...user } = result;
    return user;
  }
}