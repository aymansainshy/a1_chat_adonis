import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Message from 'App/Models/Message';
// import Message from 'App/Models/Message'
// import User from 'App/Models/User';

export default class MessagesController {

    public async getMessages(ctx: HttpContextContract) {
     // Get message sended to specific user by fetching message by reveiver 
     // Get message action by quering them by sender 

        try {
            const sMessage = await Message.query().where('sender', 1).preload('content');
            const rMessage = await Message.query().where('receiver', 1).preload('content');

            const messages = [...sMessage, ...rMessage]
            console.log(messages)

        } catch (e) {
            console.log(e)
        }
    }
}
