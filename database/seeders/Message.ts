import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Message from 'App/Models/Message'

export default class MessageSeeder extends BaseSeeder {
  public async run() {
    await Message.createMany([
      {
        is_read: false,
        is_receive: false,
        is_delivered: true,
        is_new: true,
        sender: 1,
        receiver: 2,
      },
      {
        is_read: false,
        is_receive: false,
        is_delivered: false,
        is_new: true,
        sender: 2,
        receiver: 1,
      },
    ])
  }
}
