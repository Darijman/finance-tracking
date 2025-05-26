import { DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';

const usersToCreate = [
  { name: 'john1', email: 'john1.official@mail.ru', password: '123456', currencyId: 1, roleId: 2 },
  { name: 'ADMIN', email: 'admin.official@mail.ru', password: '123456', currencyId: 1, roleId: 1 },
];

export const seedUsers = async (dataSource: DataSource) => {
  const usersRepository = dataSource.getRepository(User);
  const users = await usersRepository.find();

  if (users.length === 0) {
    const userEntities = usersToCreate.map((user) => {
      const entity = new User();
      Object.assign(entity, user);
      return entity;
    });

    await usersRepository.save(userEntities);
    console.log('✅ Users seeded');
  } else {
    console.log('ℹ️ Users already exist!');
  }
};
