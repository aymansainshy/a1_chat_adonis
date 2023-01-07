import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        name: 'Ayman',
        phone_number: '+249924081893',
      },
      {
        name: 'sohaib',
        phone_number: '+249912345678',
      },
    ])
  }
}
