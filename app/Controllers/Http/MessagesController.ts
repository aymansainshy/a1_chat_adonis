import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Message from 'App/Models/Message'

export default class MessagesController {
    public async saveMessage(ctx: HttpContextContract) {
        const messageContent  = ctx.request.input('content')
        
    }
    public async getMessages(ctx: HttpContextContract) {
        const messages = await Message.all();    
    }
}
