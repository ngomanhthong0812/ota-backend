import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from 'src/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { User } from 'src/models/user.model';
import { ResponData } from 'src/global/globalClass';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: CreateAuthDto) {
    try {
      return new ResponData<User>(
        await this.authService.handleRegister(registerDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      if (error.message) {
        return new ResponData<User>(null, HttpStatus.ERROR, error.message);
      }
      return new ResponData<User>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post('mail')
  @Public()
  async sendMail(@Body() body: { id: number; email: string; name: string }) {
    const { id, email, name } = body;
    await this.authService.sendMail(id, email, name);
    return 'ok';
  }

  @Post('activeCode')
  @Public()
  async testMail(@Body() body: { id: number; code: string }) {
    const { id, code } = body;
    try {
      return new ResponData<string>(
        await this.authService.activeCode(id, code),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      if (error.message) {
        return new ResponData<string>(null, HttpStatus.ERROR, error.message);
      }
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
