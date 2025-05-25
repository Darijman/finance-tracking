import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './createRole.dto';
import { UpdateRoleDto } from './updateRole.dto';
import { Role } from './role.entity';
import { RedisService } from 'src/common/redis/redis.service';

const ALL_ROLES_CACHE_KEY = `all_roles`;

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private readonly redisService: RedisService,
  ) {}

  async getAllRoles(): Promise<Role[]> {
    const cachedRoles: string = await this.redisService.getValue(ALL_ROLES_CACHE_KEY);
    if (cachedRoles) {
      return JSON.parse(cachedRoles);
    }

    const allRoles: Role[] = await this.rolesRepository.find();
    await this.redisService.setValue(ALL_ROLES_CACHE_KEY, JSON.stringify(allRoles), 86400); //1day
    return allRoles;
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
