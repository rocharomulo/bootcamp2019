import { startOfDay, endOfDay, parse } from 'date-fns'; // importa da biblioteca de gerenciamento de datas
import { Op } from 'sequelize'; // importa operadores do sequelize (para fazer between entre datas)

import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    // verificar se o usuário logado é prestador de serviço
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    // caso não seja prestador de serviço, retornar erro
    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parse(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          // usa operador "between" do Sequelize (importado acima)
          // buscando datas entre o início e o fim do dia (entre 00:00:00 e 23:59:59)
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
