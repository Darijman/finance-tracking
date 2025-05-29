import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './registerUser.dto';
import { Public } from './auth.decorators';
import { LogInUserDto } from './logInUser.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(201)
  @Post('register')
  async registerNewUser(@Body() registerUserDto: RegisterUserDto, @Res() res: Response) {
    const { access_token } = await this.authService.registerNewUser(registerUserDto);

    const isRemembered = registerUserDto.rememberMe === true;

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: isRemembered
        ? 30 * 24 * 60 * 60 * 1000 // 30days
        : 7 * 24 * 60 * 60 * 1000, // 7days
    });
    return res.send({ success: true });
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  async logInUser(@Body() logInUserDto: LogInUserDto, @Res() res: Response) {
    const { access_token } = await this.authService.logIn(logInUserDto);

    const isRemembered = logInUserDto.rememberMe === true;

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: isRemembered
        ? 30 * 24 * 60 * 60 * 1000 // 30days
        : 7 * 24 * 60 * 60 * 1000, // 7days
    });

    return res.send({ success: true });
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    const { id } = req.user;
    return { id };
  }

  @Public()
  @HttpCode(200)
  @Post('logout')
  logOutUser(@Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    return res.send({ success: true });
  }
}
