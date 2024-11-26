const User = require('../models/User');
const bcrypt = require('bcrypt');

function UserController() {

  function list(req, res) {
    User.findAll({ raw: true })
      .then((data) => {
        res.render('users/list', { 
          title: "Lista de Usuários",
          users: data, 
        });
      })
      .catch((err) => console.log(err));
  }

  function create(req, res) {
    res.render('users/create');
  }

  async function save(req, res) {
    const { name, email, password, confirm_password } = req.body;

    // Validação de senha
    if (password !== confirm_password) {
      return res.render('users/create', {
        old: req.body,  // Para manter os campos preenchidos
        error: {
          message: 'As senhas não coincidem.',
          field: 'password'
        }
      });
    }

    try {
      // Hash da senha
      const hashed_password = await bcrypt.hash(password, 10);

      const user = {
        name,
        email,
        password: hashed_password,
      };

      await User.create(user);  // Cria o usuário
      res.redirect('/users');
    } catch (error) {
      console.log(error);
      res.render('users/create', {
        old: req.body,  // Para manter os campos preenchidos
        error: {
          message: 'Ocorreu um erro ao salvar o usuário.',
        },
      });
    }
  }

  function remove(req, res) {
    const id = req.params.id;

    User.destroy({ where: { id: id } })
      .then(() => res.redirect('/users'))
      .catch((err) => console.log(err));
  }

  function edit(req, res) {
    const id = req.params.id;

    User.findOne({ where: { id: id }, raw: true })
      .then((data) => {
        res.render('users/edit', { user: data });
      })
      .catch((err) => console.log(err));
  }

  function update(req, res) {
    console.log(req.body);
    const id = req.body.id;

    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      active: req.body.active === '1' ? true : false,
    };

    User.update(user, { where: { id: id } })
      .then(() => res.redirect('/users'))
      .catch((err) => console.log(err));
  }

  function updateStatus(req, res) {
    const id = req.params.id;

    // Encontrar o usuário pelo ID para pegar o status atual
    User.findOne({ where: { id: id } })
      .then((user) => {
        // Verificar o status atual e alternar
        const newStatus = user.active ? false : true; // Se ativo, coloca como inativo; se inativo, coloca como ativo

        // Atualizar o status no banco de dados
        return User.update({ active: newStatus }, { where: { id: id } });
      })
      .then(() => res.redirect('/users'))  // Redirecionar para a lista de usuários
      .catch((err) => {
        console.log(err);
        res.status(500).send('Erro ao atualizar o status.');
      });
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
