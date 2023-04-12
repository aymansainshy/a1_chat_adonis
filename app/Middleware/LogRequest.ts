import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LogRequest {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    console.log(`-> ${ctx.request.method()}: ${ctx.request.url()}`)
    console.log(`-> Body ${ctx.request.input('phone_number')}}`)
    console.log(`-> Header/Options : ${ctx.request.header('options')}`)
    await next()
  }
}
