import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'

export default class Mcontent extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public text?: string

  @column()
  public file?: string

  @column()
  public message_id!: number

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => Message)
  public message!: BelongsTo<typeof Message>
}
