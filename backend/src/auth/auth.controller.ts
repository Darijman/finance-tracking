import { Body, Controller, Get, HttpCode, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './registerUser.dto';
import { Public } from './auth.decorators';
import { LogInUserDto } from './logInUser.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(201)
  @Post('register')
  async registerNewUser(@Body() registerUserDto: RegisterUserDto, @Res() res: Response) {
    const { access_token } = await this.authService.registerNewUser(registerUserDto);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({ success: true });
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  async logInUser(@Body() logInUserDto: LogInUserDto, @Res() res: Response) {
    const { access_token } = await this.authService.logIn(logInUserDto);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({ success: true });
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Post('logOut')
  logOutUser(@Res() res: Response) {
    res.clearCookie('access_token');
    return res.send({ success: true });
  }
}
