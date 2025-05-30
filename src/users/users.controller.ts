import { Controller, Post, Get, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/userdto.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { Req } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() dto: UserDto){
    return this.usersService.register(dto);
  }

  @Post('login')
  login(@Body() dto: UserDto) {
    return this.usersService.login(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  logout(@Req() req: any) {
    return this.usersService.logout(req.user.id);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  refreshTokens(@Req() req: any) {
    const userId = req.user.id;
    const refreshToken = req.user.refreshToken;
    return this.usersService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  info(@Req() req: any){
    return req.user;
  }
}
