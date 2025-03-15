import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Name must contain no more than 100 letters!' })
  name: string;
}
