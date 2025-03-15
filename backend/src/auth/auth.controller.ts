import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './registerUser.dto';
import { Public } from './auth.decorators';
import { LogInUserDto } from './logInUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(201)
  @Post('register')
  registerNewUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerNewUser(registerUserDto);
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  logInUser(@Body() logInUserDto: LogInUserDto) {
    return this.authService.logIn(logInUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
