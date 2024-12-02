const useUsersRepository = require('../../app/repositories/UserRepository.js');
const usersRepository = useUsersRepository(); 

test('Listando users', async () => {
  const users = await usersRepository.list();
  expect(users).not.toBeNull();
  expect(users.length).toBeGreaterThan(0);
});

test('Salvar user com sucesso', async () => {
  const user = await usersRepository.save({
    name: "Flavio",
    email: "favindopneu@gmail.com",
    password: "Telet0m",
    active: true,
  });

  expect(user.id).not.toBeNull();
  expect(user.name).toBe("Flavio");
  expect(user.email).toBe("favindopneu@gmail.com");
  expect(user.password).toBe("Telet0m");
  expect(user.active).toBe(true);
});

test('Encontrando User pelo ID', async () => {
  const user_data = {
    name: "Flavio",
    email: "favindopneu@gmail.com",
    password: "Telet0m",
    active: true,
  };

  const new_user = await usersRepository.save(user_data);

  const user = await usersRepository.find(new_user.id);

  expect(user.id).not.toBeNull();
  expect(user.name).toBe(user_data.name);
  expect(user.email).toBe(user_data.email);
  expect(user.password).toBe(user_data.password);
  expect(user.active).toBe(user_data.active);
});

test('Atualizando um User já existente', async () => {
  const user_data = {
    name: "Flavio",
    email: "favindopneu@gmail.com",
    password: "Telet0m",
    active: true,
  };

  const new_user = await usersRepository.save(user_data);

  const user = await usersRepository.find(new_user.id);

  user.name = "Pedro";
  await user.save();

  const updated_user = await usersRepository.find(user.id);

  expect(updated_user.name).toBe(user.name);
});

test('Removendo User do banco de dados', async () => {
  const user_data = {
    name: "Flavio",
    email: "favindopneu@gmail.com",
    password: "Telet0m",
    active: true,
  };

  const new_user = await usersRepository.save(user_data);

  await usersRepository.remove(new_user.id);

  const user = await usersRepository.find(new_user.id);

  expect(user).toBeNull();
});