import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './createRole.dto';
import { UpdateRoleDto } from './updateRole.dto';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async getAllRoles(): Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  async getRoleById(id: number): Promise<Role> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const role = await this.rolesRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException({ error: 'Role not found!' });
    }

    return role;
  }

  async createNewRole(newRole: CreateRoleDto): Promise<Role> {
    const existingRole = await this.rolesRepository.findOneBy({ name: newRole.name });
    if (existingRole) {
      throw new BadRequestException({ error: 'Role with this name already exists!' });
    }
    return await this.rolesRepository.save(newRole);
  }

  async deleteRoleById(id: number): Promise<Role> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const role = await this.rolesRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException({ error: 'Role not found!' });
    }

    await this.rolesRepository.delete(id);
    return role;
  }

  async updateRoleById(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const role = await this.rolesRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException({ error: 'Role not found!' });
    }

    Object.assign(role, updateRoleDto);
    return await this.rolesRepository.save(role);
  }
}
