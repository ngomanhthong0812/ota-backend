import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/entities/role.entity';
import { Role } from 'src/models/role.model';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async getRoles(): Promise<Role[]> {
    const roles = await this.roleRepository.find();
    return roles.map(
      (role) => new Role(role.id, role.name, role.description, role.hotel_id),
    );
  }

  async findOneRole(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    return new Role(role.id, role.name, role.description, role.hotel_id);
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new Role();
    role.name = createRoleDto.name;
    role.description = createRoleDto.description;
    role.hotel_id = createRoleDto.hotel_id;

    await this.roleRepository.save(role);
    return new Role(role.id, role.name, role.description, role.hotel_id);
  }

  async updateRole(updateRoleDto: UpdateRoleDto): Promise<Role> {
    const { id, ...updateRoleData } = updateRoleDto;

    await this.roleRepository.update(id, updateRoleData);

    const role = await this.roleRepository.findOne({ where: { id } });
    return new Role(role.id, role.name, role.description, role.hotel_id);
  }

  async deleteRole(id: number): Promise<string> {
    await this.roleRepository.delete(id);
    return `Delete role ${id} success`;
  }

  async getRoleIdByName(role_name: string): Promise<number> {
    const role = await this.roleRepository.findOne({
      where: { name: role_name },
    });
    return role.id;
  }
}
