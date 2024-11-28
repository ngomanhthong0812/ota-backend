import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from 'src/helpers/util';
import { User } from 'src/models/user.model';
import { CreateAuthDto } from './dto/create-auth.dto';
import { HotelService } from 'src/modules/hotels/hotel.service';
import { RoleService } from 'src/modules/roles/role.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private hotelService: HotelService,
    private roleService: RoleService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    let user = await this.userService.finByUserName(username);
    if (!user) {
      user = await this.userService.finByEmail(username);
    }

    if (!user) return null;

    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) return null;
    return user;
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        usename: user.user_name,
        isActive: user.isActive,
      },
    };
  }

  async handleRegister(registerDto: CreateAuthDto) {
    if (await this.hotelService.isNameExist(registerDto.name_hotel)) {
      throw new Error('Tên khách sạn đã được sử dụng!');
    }
    if (await this.hotelService.isEmailExist(registerDto.email)) {
      throw new Error('Email khách sạn đã được sử dụng!');
    }
    if (await this.userService.isUserNameExistGlobal(registerDto.username)) {
      throw new Error('Tên tài khoản đã được sử dụng');
    }
    const hotel_id = await this.hotelService.createHotelRegister(
      registerDto.name_hotel,
      registerDto.email,
    );
    const role_id = await this.roleService.getRoleIdByName(
      registerDto.role_name,
    );

    if (!hotel_id) {
      throw new Error('Không thể tạo khách sạn.');
    }
    if (!role_id) {
      throw new Error('Không thể lấy ID của role.');
    }

    const user = await this.userService.createUserRegister(
      registerDto.username,
      registerDto.email,
      registerDto.password,
      hotel_id,
      role_id,
    );

    this.sendMail(user.id, user.email, user.user_name, user.code);

    return {
      id: user.id,
      username: user.user_name,
      email: user.email,
      role: registerDto.role_name,
      hotel: {
        id: hotel_id,
        name: registerDto.name_hotel,
      },
    };
  }

  async sendMail(id: number, toEmail: string, name: string, code?: string) {
    code = code || this.userService.generate6DigitCode();
    if (code) {
      await this.userService.updateCodeById(id, code);
    }
    this.mailerService.sendMail({
      to: toEmail, // list of receivers
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome OTA', // plaintext body
      template: 'register',
      context: {
        // ✏️ filling curly brackets with content
        name: name,
        activationCode: code,
      },
    });
  }

  async activeCode(id: number, code: string) {
    await this.userService.updateIsActiveByIdAndCode(id, code);
    return 'ok';
  }
}
