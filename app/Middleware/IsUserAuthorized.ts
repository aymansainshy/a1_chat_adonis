import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'

export default class UserAuthorized {
    public async handle(ctx: HttpContextContract, next: () => Promise<void>) {

        var authorization = ctx.request.header('Authorization');
        // console.log(`-> ${request.header('Authorization')} `)

        if (!authorization) {
            const error = new Error('Not authenticated')
            return ctx.response.unauthorized({
                code: 0,
                message: 'Not authenticated!',
                data: error,
            });
        }

        const token = authorization.split(' ')[1]
        var parsedToken
        try {
            // Varify if its the right Token that created by JWT and decoded it.
            const decodedToken = jwt.verify(token, 'SECRET');
            var parsedToken = JSON.parse(JSON.stringify(decodedToken))
            
            console.log(ctx.params.id)
            console.log(parsedToken.userId)

            if (parsedToken.userId.toString() !== ctx.params.id.toString()) {
                const error = new Error('Not authenticated')
                return ctx.response.unauthorized({
                    code: 0,
                    message: 'Not authenticated!',
                    data: error,
                });
            }

        } catch {
            const error = new Error("Not authenticated")
            throw error;
        }

        await next()
    }
}