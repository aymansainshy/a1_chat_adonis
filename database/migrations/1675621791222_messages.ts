import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Message extends BaseSchema {
  protected tableName = 'messages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('uuid').notNullable()

      table.integer('sender').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('receiver').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      
      table.boolean('is_read').notNullable()
      table.boolean('is_success').notNullable()
      table.boolean('is_delivered').notNullable()
      table.boolean('is_new').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
