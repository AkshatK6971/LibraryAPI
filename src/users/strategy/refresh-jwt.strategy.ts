import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy,'jwt-refresh') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

    async validate(req: Request, payload: { sub: string; email: string }) {
        const authHeader = req.headers['authorization'];
        const refreshToken = authHeader?.replace('Bearer ', '');

        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token found');
        }

        const user = await this.prisma.user.findUnique({
            where: {
            id: payload.sub,
            },
        });

        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Invalid refresh token.');
        }

        const isTokenMatching =  await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isTokenMatching) {
            throw new UnauthorizedException('Invalid refresh token.');
        }

        const { passwordHash, refreshToken: _, ...safeUser } = user;
        return {...safeUser, refreshToken};
    }
}
