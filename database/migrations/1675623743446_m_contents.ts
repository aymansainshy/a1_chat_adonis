import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Mcontent extends BaseSchema {
  protected tableName = 'm_contents'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('message_id').unsigned().notNullable().references('id').inTable('messages').onDelete('CASCADE')
  
      table.string('content').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
