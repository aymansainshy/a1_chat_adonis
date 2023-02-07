// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MContent from 'App/Models/MContent';
import Message from 'App/Models/Message';
// import Message from 'App/Models/Message'
// import User from 'App/Models/User';

export default class MessagesController {
    public async saveMessage(message: any) {
        console.log(message)

        try {
            const searchedPayload = { id: message.id }
            const persistancePayload = {
                is_read: message.is_read,
                is_receive: message.is_receive,
                is_delivered: message.is_delivered,
                is_new: message.is_new,
                sender: message.sender.id,
                receiver: message.receiver.id,
            }

            const updatedMessage = await Message.updateOrCreate(searchedPayload, persistancePayload)

            const cSearchedPayload = { message_id: updatedMessage.id }
            const cPersistancePayload = { content: message.content }
            await MContent.updateOrCreate(cSearchedPayload, cPersistancePayload)

            console.log("Message Created Successfully")

        } catch (error) {
            console.log(error)
        }
    }

    public async getMessages() {
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
