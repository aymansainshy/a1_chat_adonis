import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MContent from 'App/Models/MContent'
import Message from 'App/Models/Message'
import User from 'App/Models/User'

export default class MessagesController {
    public async saveMessage(message: any) {
        console.log(message)

        try {
            // This part for the reciever to update message status .
            const messageData = {
                is_read: message.is_read,
                uuid: message.uuid,
                type: message.type,
                is_success: message.is_success,
                is_delivered: message.is_delivered,
                is_new: message.is_new,
                sender: message.sender.id,
                receiver: message.receiver.id,
            }

            const foundedMessage = await Message.find(message.id)

            if (foundedMessage) {
                ; (foundedMessage.uuid = message.uuid),
                    (foundedMessage.is_read = message.is_read),
                    (foundedMessage.is_success = message.is_success),
                    (foundedMessage.is_delivered = message.is_delivered),
                    (foundedMessage.is_new = message.is_new),
                    await foundedMessage.save()

                console.log('Message Updated Successfully')
            } else {
                // This part for the sender to save message when the reciever not connected .
                const newMessage = await Message.create(messageData)

                await MContent.create({
                    message_id: newMessage.id,
                    text: message.content.text,
                    file: message.content.file,
                })

                console.log('Message Created Successfully')
            }
        } catch (error) {
            console.log(error)
        }
    }

    private fetchMessageWithUsers = async (messages: Message[]) => {
        const promises = messages.map(async (message: Message) => {
            const sender = await User.find(message.sender)
            const receiver = await User.find(message.receiver)

            console.log(sender)

            return {
                ...message.$original,
                is_read: message.is_read ? true : false,
                is_new: message.is_new ? true : false,
                is_delivered: message.is_delivered ? true : false,
                is_success: message.is_success ? true : false,
                content: message.content.$original,
                sender: sender?.$original,
                receiver: receiver?.$original,
            }
        })

        return await Promise.all(promises)
    }

    public async getUserMessages(ctx: HttpContextContract) {
        const sender = ctx.request.param('id')

        try {
            const userLastMessages: Message[] = await Message.query()
                .where('sender', sender)
                .preload('content')

            if (!userLastMessages) {
                return ctx.response.send({
                    code: 1,
                    message: 'User Messages',
                    data: [],
                })
            }
            await Message.query().where('sender', sender).where('is_delivered', 1).delete()

            const messagesWithUsers = await this.fetchMessageWithUsers(userLastMessages)

            console.log(messagesWithUsers)

            return ctx.response.send({
                code: 1,
                message: 'User Messages',
                data: messagesWithUsers,
            })
        } catch (error) {
            console.log(error)
            return ctx.response.status(500).send({
                code: 0,
                message: 'Server error !',
                data: error,
            })
        }
    }

    public async getUserReceivedMessages(ctx: HttpContextContract) {
        const receiver = ctx.request.param('id')

        try {
            const userReceivedMessages: Message[] = await Message.query()
                .where('receiver', receiver)
                .where('is_delivered', 0)
                .preload('content')

            if (!userReceivedMessages) {
                return ctx.response.send({
                    code: 1,
                    message: 'User Messages',
                    data: [],
                })
            }

            const messagesWithUsers = await this.fetchMessageWithUsers(userReceivedMessages)

            return ctx.response.send({
                code: 1,
                message: 'User Messages',
                data: messagesWithUsers,
            })
        } catch (error) {
            console.log(error)
            return ctx.response.status(500).send({
                code: 0,
                message: 'Server error !',
                data: error,
            })
        }
    }

    public async uploadFile(ctx: HttpContextContract) {
        try {
            const image = ctx.request.file('image', {
                size: '5mb',
                extnames: ['jpg', 'png', 'gif', 'jpeg'],
            })

            if (!image) {
                return ctx.response.status(410).send({
                    code: 0,
                    message: 'Invalid image!',
                    data: {},
                })
            }

            if (!image.isValid) {
                return ctx.response.status(413).send({
                    code: 0,
                    message: 'image error !',
                    data: image.errors,
                })
            }

            if (image) {
                // await image.move(Application.tmpPath('uploads'))
                // console.log(`File name ->  ${image?.fieldName}`);

                await image.moveToDisk('./images/')

                const fileName = image?.fileName

                return ctx.response.status(203).send({
                    code: 1,
                    message: 'Image updated successfully !',
                    data: fileName,
                })
            }
        } catch (error) {
            console.log(error)
            return ctx.response.status(500).send({
                code: 0,
                message: 'Server error !',
                data: error,
            })
        }
    }
}
