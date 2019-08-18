import * as Yup from 'yup'; // esquema de validação
import { startOfHour, parse, isBefore, format } from 'date-fns'; // importa alguns métodos da biblioteca que lida com datas
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import User from '../models/User';
import File from '../models/File';

class AppointmentController {
  async index(req, res) {
    // busca o número da página de req.query; se não for informado, por padrão a página é 1
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      // lista até 20 registros
      limit: 20,
      // quantos registros eu quero pular (paginação), calcula conforme o número da pagina do get
      offset: (page - 1) * 20,
      // inclui dados do prestador de serviços (relacionamentos)
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          // inclui o avatar do usuario
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { provider_id, date } = req.body;

    // Check if provider id is a provider
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    // validação da hora de início
    //   parseISO transforma a string em um objeto date do JS para ser usando denetro do método StartOfHour
    //   ou seja, vai pegar apenas a hora e não os minutos e segundos (sempre vai zerar minutos e segundos)
    const hourStart = startOfHour(parse(date));

    // verifica se a hora do agendamente é anterior à hora atual
    // se passar, quer dizer que a data que ele quer utilizar já passou...
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    // verifica se já não tem agendamento para o mesmo horário
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null, // o campo canceledAt não está na tabela...
        date: hourStart,
      },
    });

    // se já tem agendamento para o horário, gerar erro
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    // busca o nome do usuario na tabela
    const user = await User.findByPk(req.userId);

    const formattedDate = format(hourStart, 'DD [de] MMMM [às] H:mm', {
      locale: pt,
    });

    // notificar prestador de serviço
    await Notification.create({
      content: `Novo agendamento de ${user.name} para dia ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
