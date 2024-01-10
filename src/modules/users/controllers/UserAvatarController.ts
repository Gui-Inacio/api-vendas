
import UpdateUserAvatarService from "../services/UpdateUserAvatarService";
import { Request, Response } from "express";

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatar = new UpdateUserAvatarService();

    const user = await updateAvatar.execute({

      user_id: request.user.id,
      avatarFilename: request.file,
    });

    return response.json(user);
  }
}
