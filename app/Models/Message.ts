import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import MContent from './MContent'
import { MessageType } from 'Contracts/enum'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public uuid?: string

  @column()
  public type?: MessageType

  @column({
    serialize: (value?: Number) => {
      return Boolean(value)
    },
  })
  public is_read?: boolean

  @column({
    serialize: (value?: Number) => {
      return Boolean(value)
    },
  })
  public is_success?: boolean

  @column({
    serialize: (value?: Number) => {
      return Boolean(value)
    },
  })
  public is_delivered?: boolean


  @column({
    serialize: (value?: Number) => {
      return Boolean(value)
    },
  })
  public is_new?: boolean

  @column()
  public sender?: number

  @column()
  public receiver?: number


  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @hasOne(() => MContent, {
    foreignKey: 'message_id'
  })
  public content!: HasOne<typeof MContent>
}
