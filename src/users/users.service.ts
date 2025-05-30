import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/userdto.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

    async register(dto: UserDto) {
        try{
            const hash = await bcrypt.hash(dto.password, 10);

            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    passwordHash: hash,
                }
            });

            const tokens = await this.signTokens(user.id, user.email);
            await this.updateRefreshToken(user.id, tokens.refreshToken);
            return tokens;
            
        }
        catch (error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002')
                    throw new ForbiddenException('Email taken.');
            }
            throw error;
        }
    }
    
    async login(dto: UserDto) {
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email
            }
        });

        if(!user)
            throw new ForbiddenException('Incorrect Email or Password.')

        const match = await bcrypt.compare(dto.password, user.passwordHash);

        if(!match)
            throw new ForbiddenException('Incorrect Email or Password.');

        const tokens = await this.signTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;   
    }
    
    async logout(id: string){
        const result =  await this.prisma.user.update({
            where:{
                id: id,
            },
            data: {
                refreshToken: null,
            }
        });    

        const {passwordHash, ...user} = result;
        return user; 
    }

    async updateRefreshToken(id: string, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                refreshToken: hashedRefreshToken,
            }
        });
    }
    
    async refreshTokens(id: string, refreshToken: string){
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            }
        });

        if(!user)
            throw new UnauthorizedException("Invalid refresh Token.");
        
        const tokens = await this.signTokens(id, user.email);
        await this.updateRefreshToken(id, tokens.refreshToken);
        return tokens;    
    }

    async signTokens(id: string, email: string){
        const payload = {
            sub: id,
            email: email,
        }

        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        });

        const refreshSecret = this.config.get('JWT_REFRESH_SECRET');
        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: '7d',
            secret: refreshSecret,
        });

        return {accessToken: token, refreshToken: refreshToken};
    }
}
