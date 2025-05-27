import { Roles } from './roles';

export interface BasicUser {
  id: number;
  roleName: Roles;
  name: string;
}
