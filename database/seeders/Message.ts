import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Message from 'App/Models/Message'
import { DateTime } from 'luxon'

export default class MessageSeeder extends BaseSeeder {
  public async run() {
    await Message.createMany([
      {
        uuid: DateTime.now().toString(),
        is_read: false,
        is_success: false,
        is_delivered: true,
        is_new: true,
        sender: 1,
        receiver: 2,
      },
      {
        uuid: DateTime.now().toString(),
        is_read: false,
        is_success: false,
        is_delivered: false,
        is_new: true,
        sender: 2,
        receiver: 1,
      },
    ])
  }
}
