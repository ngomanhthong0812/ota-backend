import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { hashPasswordHelper } from 'src/helpers/util';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  isUserNameExistGlobal = async (user_name: string) => {
    const user = await this.userRepository.findOne({ where: { user_name } });
    if (user) return true;
    return false;
  };

  isUserNameExist = async (user_name: string, hotel_id: number) => {
    const user = await this.userRepository.findOne({
      where: { user_name, hotel_id },
    });
    if (user) return true;
    return false;
  };

  isEmailExist = async (email: string, hotel_id: number) => {
    const user = await this.userRepository.findOne({
      where: { email, hotel_id },
    });
    if (user) return true;
    return false;
  };
  isPhoneExist = async (phone: string, hotel_id: number) => {
    const user = await this.userRepository.findOne({
      where: { phone, hotel_id },
    });
    if (user) return true;
    return false;
  };

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users.map(
      (user) =>
        new User(
          user.id,
          user.user_name,
          user.password,
          user.email,
          user.phone,
          user.hotel_id,
          user.role_id,
          user.code,
          user.isActive,
        ),
    );
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await hashPasswordHelper(createUserDto.password);
    const user = new UserEntity();
    user.user_name = createUserDto.user_name;
    user.password = hashPassword;
    user.email = createUserDto.email;
    user.phone = createUserDto.phone;
    user.hotel_id = createUserDto.hotel_id;
    user.role_id = createUserDto.role_id;
    user.code = this.generate6DigitCode();
    user.isActive = true;

    if (
      user.user_name &&
      (await this.isUserNameExist(user.user_name, user.hotel_id))
    ) {
      throw new Error('Tên tài khoản đã được đăng kí trong khách sạn');
    }

    if (user.email && (await this.isEmailExist(user.email, user.hotel_id))) {
      throw new Error('Email đã được đăng kí trong khách sạn');
    }
    if (user.phone && (await this.isPhoneExist(user.phone, user.hotel_id))) {
      throw new Error('Số điện thoại đã được đăng kí trong khách sạn');
    }

    await this.userRepository.save(user);
    return new User(
      user.id,
      user.user_name,
      user.password,
      user.email,
      user.phone,
      user.hotel_id,
      user.role_id,
      user.code,
      user.isActive,
    );
  }

  async getDetailUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    return new User(
      user.id,
      user.user_name,
      user.password,
      user.email,
      user.phone,
      user.hotel_id,
      user.role_id,
      user.code,
      user.isActive,
    );
  }

  async finByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
  async finByUserName(user_name: string) {
    return await this.userRepository.findOne({ where: { user_name } });
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<string> {
    const { id, hotel_id, ...updateData } = updateUserDto;

    if (
      updateData.email &&
      (await this.isEmailExist(updateData.email, hotel_id))
    ) {
      throw new Error('Email đã được đăng kí trong khách sạn');
    }

    if (
      updateData.phone &&
      (await this.isPhoneExist(updateData.phone, hotel_id))
    ) {
      throw new Error('Số điện thoại đã được đăng kí trong khách sạn');
    }

    if (
      updateData.user_name &&
      (await this.isUserNameExist(updateData.user_name, hotel_id))
    ) {
      throw new Error('Tên tài khoản đã được đăng kí trong khách sạn');
    }

    if (updateData.password) {
      updateData.password = await hashPasswordHelper(updateData.password);
    }
    await this.userRepository.update(id, updateData);

    return 'Update success';
  }

  async deleteUser(id: number): Promise<string> {
    await this.userRepository.delete(id);
    return `Delete user ${id} success`;
  }

  async createUserRegister(
    user_name: string,
    email: string,
    password: string,
    hotel_id: number,
    role_id: number,
  ): Promise<User> {
    const hashPassword = await hashPasswordHelper(password);
    const user = new UserEntity();
    user.user_name = user_name;
    user.password = hashPassword;
    user.email = email;
    user.hotel_id = hotel_id;
    user.role_id = role_id;
    user.code = this.generate6DigitCode();
    user.isActive = false;

    await this.userRepository.save(user);
    return new User(
      user.id,
      user.user_name,
      user.password,
      user.email,
      user.phone,
      user.hotel_id,
      user.role_id,
      user.code,
      user.isActive,
    );
  }
  async updateCodeById(id: number, code: string) {
    await this.userRepository.update(id, { code });
    return 'update success';
  }
  async updateIsActiveByIdAndCode(id: number, code: string) {
    const user = await this.userRepository.findOne({ where: { id, code } });
    console.log(user);
    if (user) {
      await this.userRepository.update(id, { isActive: true });
    } else {
      throw new Error('Mã xác nhận không đúng');
    }
    return 'update success';
  }

  generate6DigitCode() {
    const uuid = uuidv4(); // Tạo UUID
    const shortCode =
      parseInt(uuid.replace(/-/g, '').slice(0, 6), 16) % 1000000; // Chuyển thành số 6 chữ số
    return shortCode.toString().padStart(6, '0'); // Đảm bảo đủ 6 chữ số
  }
}
