import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        name: 'Ayman',
        phone_number: '+249917727266',
        image_Url: 'cld1u7kq50001dxlq3dn81kq6.jpeg',
      },
      {
        phone_number: '+249924081893',
        image_Url: 'clcow8vds0001ialq2gy652v6.png',
      },
    ])
  }
}
