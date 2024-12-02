const User = require('../models/User');
const bcrypt = require('bcrypt');

function UserController() {
  async function list(req, res) {
    try {
      const data = await User.findAll({ raw: true });
      res.render('users/list', {
        title: "Lista de Usuários",
        users: data,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao listar usuários.");
    }
  }

  function create(req, res) {
    res.render('users/create');
  }

  async function save(req, res) {
    const { name, email, password, password_confirmation } = req.body;

    // Verifica se as senhas são iguais
    if (password !== password_confirmation) {
      return res.render('users/create', {
        error: { message: 'As senhas não coincidem. Tente novamente.' },
        old: req.body,
      });
    }

    try {
      // Criptografa a senha
      const hashed_password = await bcrypt.hash(password, 10);

      // Cria o usuário no banco
      await User.create({ name, email, password: hashed_password });
      res.redirect('/users');
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao salvar usuário.");
    }
  }

  async function remove(req, res) {
    const { id } = req.params;

    try {
      await User.destroy({ where: { id } });
      res.redirect('/users');
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao remover usuário.");
    }
  }

  async function edit(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findOne({ where: { id }, raw: true });
      if (!user) {
        return res.status(404).send("Usuário não encontrado.");
      }
      res.render('users/edit', { user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao buscar usuário.");
    }
  }

  async function update(req, res) {
    const { id, name, email, password, active } = req.body;

    const user = {
      name,
      email,
      password,
      active: active === '1',
    };

    try {
      await User.update(user, { where: { id } });
      res.redirect('/users');
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao atualizar usuário.");
    }
  }

  async function updateStatus(req, res) {
    const { id } = req.params;

    try {
      // Busca o usuário no banco para obter o status atual
      const user = await User.findOne({ where: { id } });
      if (!user) {
        return res.status(404).send("Usuário não encontrado.");
      }

      // Alterna o status atual
      const newStatus = !user.active;

      // Atualiza o status no banco
      await User.update({ active: newStatus }, { where: { id } });
      res.redirect('/users');
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao atualizar o status.");
    }
  }

  return {
    create,
    save,
    list,
    remove,
    edit,
    update,
    updateStatus,
  };
}

module.exports = UserController();