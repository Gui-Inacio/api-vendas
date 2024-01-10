import { getCustomRepository } from "typeorm";
import AppError from "@shared/errors/AppError";
import User from "../typeorm/entities/User";
import UsersRepository from "../typeorm/repositories/UserRepository";
import path from "path";
import fs from 'fs';
import uploadConfig from '@config/upload';




interface IRequest {
  user_id: string;
  avatarFilename: Express.Multer.File | undefined;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }
    if (!avatarFilename) {
      throw new AppError('Avatar não pode ser nulo.')
    }
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename.filename;


    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
