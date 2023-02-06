import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import MContent from 'App/Models/MContent'

export default class extends BaseSeeder {
  public async run() {
   await MContent.createMany([
      {
        message_id: 1,
        content: "hi",
      },
      {
        message_id: 2,
        content: "hi, How are you doing?",
      },
    ])
  }
}
