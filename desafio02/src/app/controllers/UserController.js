// importa bibilioteca Yup, que faz validações de entrada dos dados do usuário (campos do request - JSON)
import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  // Cadastro de usuários (mesma face de um middleware do node)
  //   Obs: processo asíncrono indica que não roda em tempo real, pode demorar um pouco, e precisa usar o await
  //        em toda operação que faz no banco de dados
  async store(req, res) {
    // usa o Schema validation do Yup para validar os campos de entrada do request, informando o formato
    // que eu quero que o objeto tenha (no caso, o req.body)
    const schema = Yup.object().shape({
      // nome deve ser string e obrigatório
      name: Yup.string().required(),
      // email deve ser string, no formato de email e obrigatório
      email: Yup.string()
        .email()
        .required(),
      // senha deve ser string, obrigatória e ter no mínimo 6 dígitos
      password: Yup.string()
        .required()
        .min(6),
    });

    // verificar se o req.body está sendo passado conforme o schema acima
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // verifica se já existe usuário com o email que estou tentando cadastrar
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      // bloqueia o fluxo, dando um return com resposta 400
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  // rota só pode ser acessada por usuários que estejam logados
  async update(req, res) {
    // usa o Schema validation do Yup para validar os campos de entrada do request, informando o formato
    // que eu quero que o objeto tenha (no caso, o req.body)
    const schema = Yup.object().shape({
      // nome deve ser string
      name: Yup.string(),
      // email deve ser string, no formato de email
      email: Yup.string().email(),
      // caso a senha anterior tenha sido informada, ela deve ter no mínimo 6 dígitos
      oldPassword: Yup.string().min(6),
      // senha deve ser string, obrigatória e ter no mínimo 6 dígitos
      password: Yup.string()
        .min(6)
        // quando estiver sendo preenchido o oldPassword, o campo da nova senha deve ser obrigatório,
        // senão o campo password (field) será retornado sem ser obrigatório
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      // caso o campo senha tiver sido preenchido, exigir um outro campo chamado confirmPassword,
      // e verificar se os campos password e confirmPassword são identicos
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // verificar se o req.body está sendo passado conforme o schema acima
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // busca email e oldPassword do req.body
    const { email, oldPassword } = req.body;

    // localizar usuario no banco de dados, usando metodo findByPk (find by primary key)
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      // verifica se já existe usuário com o email que estou tentando cadastrar
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        // bloqueia o fluxo, dando um return com resposta 400
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    // caso o usuário esteja tentando alterar a senha dele (existe o campo oldPassword no req.body )
    // verifica se o oldPassword que o usuário está enviando bate com a senha atual no banco de dados
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // caso tenha passado as duas verificações acima, faz o update dos dados do usuário
    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
