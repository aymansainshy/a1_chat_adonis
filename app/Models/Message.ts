import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import MContent from './MContent'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public uuid?: string

  @column()
  public is_read?: boolean

  @column()
  public is_success?: boolean

  @column()
  public is_delivered?: boolean

  @column()
  public sender?: number

  @column()
  public receiver?: number

  @column()
  public is_new?: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @hasOne(() => MContent , {
    foreignKey : 'message_id'
  })
  public content!: HasOne<typeof MContent>
}
