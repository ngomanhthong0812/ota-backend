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
import { RoleService } from './role.service';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Role } from 'src/models/role.model';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getRoles(): Promise<ResponData<Role[]>> {
    try {
      return new ResponData<Role[]>(
        await this.roleService.getRoles(),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Role[]>(
        await this.roleService.getRoles(),
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Get(':id')
  async findOneRole(@Param('id') id: number): Promise<ResponData<Role>> {
    try {
      return new ResponData<Role>(
        await this.roleService.findOneRole(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Role>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post()
  async createRole(
    @Body(new ValidationPipe()) createRoleDto: CreateRoleDto,
  ): Promise<ResponData<Role>> {
    try {
      return new ResponData<Role>(
        await this.roleService.createRole(createRoleDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Role>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put()
  async updateRole(
    @Body(new ValidationPipe()) updateRoleDto: UpdateRoleDto,
  ): Promise<ResponData<Role>> {
    try {
      return new ResponData<Role>(
        await this.roleService.updateRole(updateRoleDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Role>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: number): Promise<ResponData<string>> {
    try {
      return new ResponData<string>(
        await this.roleService.deleteRole(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
