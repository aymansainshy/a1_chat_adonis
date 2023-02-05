import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import MessageContent from './MContent'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public isRead?: Boolean

  @column()
  public isReceive?: Boolean

  @column()
  public isDelivered?: Boolean

  @column()
  public isNew?: Boolean

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @hasOne(() => MessageContent)
  public content!: HasOne<typeof MessageContent>
  
}
