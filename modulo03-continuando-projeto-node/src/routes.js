// Esta é uma forma de separar apenas a parte de roteamento do Express em outro arquivo
import { Router } from 'express'; // importa do express apenas o Router
import multer from 'multer'; // importa o multer, para manipular requisições MULTPART-FORM-DATA
import multerConfig from './config/multer'; // importa arquivo de configurações do multer (upload do arquivo em si)

import UserController from './app/controllers/UserController'; // importa UserController
import SessionController from './app/controllers/SessionController'; // importa SessionController
import FileController from './app/controllers/FileController'; // importa FileController
import ProviderController from './app/controllers/ProviderController'; // importa FileController

// importa middleware de autenticação da sessão
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig); // passa o arquivo multerConfig como parâmetro para o upload de arquivos

// ROTAS

// Cria usuário
routes.post('/users', UserController.store);

// Cria sessão
routes.post('/sessions', SessionController.store);

// Usa middleware global para autenticação, que será usado apenas para as rotas que vem logo abaixo
routes.use(authMiddleware);

// Update de usuário
routes.put('/users', UserController.update);

// Listar todos os provedores da tabela de usuários
routes.get('/providers', ProviderController.index);

// Upload do arquivo com avatar do usuário, colocamos um middleware a mais nesta rota: upload.single
routes.post('/files', upload.single('file'), FileController.store);

export default routes; // exporta as rotas
