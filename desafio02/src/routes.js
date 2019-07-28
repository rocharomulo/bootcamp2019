// Esta é uma forma de separar apenas a parte de roteamento do Express em outro arquivo
import { Router } from 'express'; // importa do express apenas o Router
import UserController from './app/controllers/UserController'; // importa UserController
import SessionController from './app/controllers/SessionController'; // importa SessionController

// importa middleware de autenticação da sessão
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// ROTAS

// Cria usuário
routes.post('/users', UserController.store);

// Cria sessão
routes.post('/sessions', SessionController.store);

// Usa middleware global para autenticação, que será usado apenas para as rotas que vem logo abaixo
routes.use(authMiddleware);

// Update de usuário
routes.put('/users', UserController.update);

export default routes; // exporta as rotas
