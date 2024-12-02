const User = require('../models/User');
function useUsersRepository() {
  async function list() {
    const users = await User.findAll({ raw: true });
    return users;
  }
  async function find(id) {
    const user = await User.findByPk(id);
    return user;
  }
  async function save(dados) {
    const user = {
      name: dados.name,
      email: dados.email,
      password: dados.password,
      active: dados.active,
    }
    const user_created = await User.create(user);
    return user_created;
  }
  async function update(id, dados) {
    const user = {
      name: dados.name,
      email: dados.email,
      password: dados.password,
      active: dados.active,
    }
    const user_updated = await User.update(user, { where: { id: id } });
    return user_updated;
  }
  async function remove(id) {
    await User.destroy({ where: { id: id } });
  }
  return {
    list,
    find,
    save,
    remove,
    update,
  }
}
module.exports = useUsersRepository;