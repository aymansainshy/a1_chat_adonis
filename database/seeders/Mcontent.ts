import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import MContent from 'App/Models/MContent'

export default class McontentSeeder extends BaseSeeder {
  public async run() {
    await MContent.createMany([
      {
        message_id: 2,
        text: 'hi',
      },
      {
        message_id: 3,
        text: 'hi, How are you doing?',
      },
    ])
  }
}
