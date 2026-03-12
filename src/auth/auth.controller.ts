import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {

    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );

    return this.authService.login(user);
  }
}