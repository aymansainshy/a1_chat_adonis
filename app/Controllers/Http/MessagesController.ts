// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MContent from 'App/Models/MContent';
import Message from 'App/Models/Message';
// import Message from 'App/Models/Message'
// import User from 'App/Models/User';

export default class MessagesController {
    public async saveMessage(message: any) {
        console.log(message)

        try {

            const messageData = {
                is_read: message.is_read,
                is_success: message.is_success,
                is_delivered: message.is_delivered,
                is_new: message.is_new,
                sender: message.sender.id,
                receiver: message.receiver.id,
            }

            const foundedMessage = await Message.find(message.id);
            if (foundedMessage) {

                foundedMessage.is_read = message.is_read,
                    foundedMessage.is_success = message.is_success,
                    foundedMessage.is_delivered = message.is_delivered,
                    foundedMessage.is_new = message.is_new,
                    foundedMessage.sender = message.sender.id,
                    foundedMessage.receiver = message.receiver.id,

                    await foundedMessage.save()

                    console.log("Message Updated Successfully")
            } else {
                const newMessage = await Message.create(messageData);

                await MContent.create({
                    message_id: newMessage.id,
                    content: message.content,
                })

                console.log("Message Created Successfully")

            }


           

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
