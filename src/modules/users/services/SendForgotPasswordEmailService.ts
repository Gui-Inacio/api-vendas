import { getCustomRepository } from "typeorm";
import path from "path";
import AppError from "../../../shared/errors/AppError";
import UsersRepository from "../typeorm/repositories/UserRepository";
import UsersTokensRepository from "../typeorm/repositories/UserTokensRepository";
import EtherealMail from "@config/mail/EtherealMail";

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const usersTokensRepository = getCustomRepository(UsersTokensRepository);

    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists.');
    }
    console.log(user);

    const token = await usersTokensRepository.generate(user.id);

    const forgotPaswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs')

    await EtherealMail.sendMail({
      to: {
        name: user.name,
        email: user.email,

      },
      subject: '[API Vendas] Recuperação de Senha',
      templateData: {
        file: forgotPaswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token.token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
