import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { UserService } from './user.service';
import { User } from 'src/models/user.model';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Public } from 'src/decorator/customize';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<ResponData<User[]>> {
    try {
      const users = await this.userService.getUsers();
      return new ResponData<User[]>(
        users,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<User[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get(':id')
  async getDetailUser(@Param('id') id: number): Promise<ResponData<User>> {
    try {
      const user = await this.userService.getDetailUser(id);
      console.log(user);

      return new ResponData<User>(
        user,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<User>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
  @Public()
  @Post()
  async createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<ResponData<User>> {
    try {
      const user = await this.userService.createUser(createUserDto);
      return new ResponData<User>(
        user,
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

  @Put()
  async updateUser(
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ): Promise<ResponData<string>> {
    try {
      return new ResponData<string>(
        await this.userService.updateUser(updateUserDto),
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

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<ResponData<string>> {
    try {
      return new ResponData<string>(
        await this.userService.deleteUser(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
