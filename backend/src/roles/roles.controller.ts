import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './createRole.dto';
import { UpdateRoleDto } from './updateRole.dto';
import { Admin, Public } from 'src/auth/auth.decorators';
import { Role } from './role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Admin()
  @Get()
  async getAllRoles(): Promise<Role[]> {
    return await this.rolesService.getAllRoles();
  }

  @Public()
  // @Admin()
  @Post()
  async createNewRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.rolesService.createNewRole(createRoleDto);
  }

  @Admin()
  @Get(':id')
  async getRoleById(@Param('id') id: number): Promise<Role> {
    return await this.rolesService.getRoleById(id);
  }

  @Admin()
  @Delete(':id')
  async deleteRoleById(@Param('id') id: number): Promise<Role> {
    return await this.rolesService.deleteRoleById(id);
  }

  @Admin()
  @Put(':id')
  async updateRoleById(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto): Promise<Role> {
    return await this.rolesService.updateRoleById(id, updateRoleDto);
  }
}
