import { IsNotEmpty, IsEnum } from 'class-validator';
import { Roles } from './role.entity';
import { Transform } from 'class-transformer';

export class UpdateRoleDto {
  @IsEnum(Roles, { message: 'Role must be either ADMIN or USER' })
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: Roles;
}
