import jwt from 'jsonwebtoken'; // importa módulo de autenticação JWT
import * as Yup from 'yup'; // importa a biblioteca Yup de validação dos dados de entrada

import User from '../models/User'; // importa usuário
import authConfig from '../../config/auth'; // importa configurações do token JWT

class SessionController {
  async store(req, res) {
    // usa o Schema validation do Yup para validar os campos de entrada do request, informando o formato
    // que eu quero que o objeto tenha (no caso, o req.body)
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      // caso a senha anterior tenha sido informada, ela deve ter no mínimo 6 dígitos
      password: Yup.string().required(),
    });

    // verificar se o req.body está sendo passado conforme o schema acima
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    // primeiramente, verificar se email existe
    const user = await User.findOne({ where: { email } });

    // se usuário não existe
    if (!user) {
      // status 401 = não autorizado
      return res.status(401).json({ error: 'User not found' });
    }

    // verificar se a senha está correta
    if (!(await user.checkPassword(password))) {
      // status 401 = não autorizado
      return res.status(401).json({ error: 'Password does not match' });
    }

    // tudo certo com a autenticação
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      // o metodo sign() gera o token
      // - 1o. parametro é o PAYLOAD (Dados Adicionais a incorporar dentro do token)
      // - 2o. parametro é um string único em "todas as aplicações do universo" (texto seguro que só a gente terá acesso)
      // - 3o. parametro: algumas configurações para o token
      token: jwt.sign({ id }, authConfig.secret, {
        // o token vai expirar em 7 dias
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
