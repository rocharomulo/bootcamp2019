import * as Yup from 'yup'; // esquema de validação
import { startOfHour, parse, isBefore } from 'date-fns'; // importa alguns métodos da biblioteca que lida com datas
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
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
    console.log(date);
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
      user_id: req.user_id,
      provider_id,
      date,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
