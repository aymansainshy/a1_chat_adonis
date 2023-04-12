import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import socketContainer from "App/helper/OnlineUserContainer";

export default class OnlineUsersController {
    public async getOnlineUsers(ctx: HttpContextContract) {
        try {

            var onlineUser = Array.from(socketContainer().values())
            console.log(onlineUser);

            return ctx.response.status(200).send({
                code: 1,
                message: 'founded data',
                data: onlineUser,
            });
        } catch (e) {
            console.log(e);
            return ctx.response.status(410).send({
                code: 0,
                message: 'Error ',
                data: e
            });
        }
    }
}
