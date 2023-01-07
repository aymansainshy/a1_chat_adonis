import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Otp extends BaseSchema {
  protected tableName = 'otps'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('otp')
      table.string('phone_number')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
