// verifica se usuário está logado

import jwt from 'jsonwebtoken';

// promisify é uma função que pega uma função de callback e transforma ela numa função que pode usar async/await
import { promisify } from 'util';

// Importa o segredo do token
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // Header que está sendo enviado pelo Insomnia
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // não autorizado
    return res.status(401).json({ error: 'Token not provided' });
  }

  // dividir o token em um array, com separação onde há um espaço.
  // exemplo do token original:
  // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNTYzNjY3OTA5LCJleHAiOjE1NjQyNzI3MDl9.caGLxol_Nn3XSgaBHEQUFP-Yz6No7ZS-msewRMWdedI
  // ou seja, só nos intereça o código que vem após o string "Bearer "
  // logo, só o que me interessa é a segunda posição do array, que vou guardar na constante 'token'
  const [, token] = authHeader.split(' ');

  // usamos try/catch, porque pode retornar erro
  try {
    // verifica o token informado pelo usuário
    // promisify(jwt.verify) transforma a função numa outra função que não precisa usar o antigo 'callback'
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // importar o id do usuário para o req
    req.userId = decoded.id;

    // se deu tudo certo com a verificação, dentro da constante 'decoded'
    // estarão as informações que usamos na hora de gerar o token
    console.log(decoded);

    // se chegou até aqui, uso o next() para dizer que o usuário pode acessar o controller normalmente,
    // porque ele está autenticado
    return next();
  } catch (err) {
    // se retornar algum erro, significa que o token é inválido
    return res.status(401).json({ error: 'Token invalid' });
  }
};
