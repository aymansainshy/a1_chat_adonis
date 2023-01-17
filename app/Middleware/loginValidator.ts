import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class LoginValidator {
    public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
        try {

            const loginSchema = schema.create({
                phone_number: schema.string({}, [
                    rules.minLength(8),
                    rules.maxLength(15)
                ])
            })

            await ctx.request.validate({
                schema: loginSchema
            })

            await next()
        } catch (error) {
            return ctx.response.badRequest({
                code: 0,
                message: 'invalid input !',
                data: error
            })
        }
    }
}