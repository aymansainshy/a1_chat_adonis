import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public name?: string

  @column()
  public phone_number?: string

  @column()
  public image_Url?: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @hasMany(() => Message, {
    foreignKey: 'sender',
  })
  messages!: HasMany<typeof Message>
}
