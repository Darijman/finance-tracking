import { IsNotEmpty, IsEnum } from 'class-validator';
import { Roles } from './role.entity';

export class CreateRoleDto {
  @IsEnum(Roles, { message: 'Role must be either ADMIN or USER' })
  @IsNotEmpty()
  name: Roles;
}
