import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Message extends BaseSchema {
  protected tableName = 'messages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('sender').unsigned().nullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('receiver').unsigned().nullable().references('id').inTable('users').onDelete('CASCADE')
      
      table.boolean('is_read')
      table.boolean('is_receive')
      table.boolean('is_delivered')
      table.boolean('is_new')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
