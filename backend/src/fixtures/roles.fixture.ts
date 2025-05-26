import { DataSource } from 'typeorm';
import { Role, Roles } from '../roles/role.entity';

export const seedRoles = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Role);
  const roles = await roleRepository.find();

  if (roles.length === 0) {
    await roleRepository.save([{ name: Roles.ADMIN }, { name: Roles.USER }]);
    console.log('✅ Roles seeded');
  } else {
    console.log('ℹ️ Roles already exist!');
  }
};
