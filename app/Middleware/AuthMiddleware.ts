import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'

export default class AuthMiddlware {
    public async handle(ctx: HttpContextContract, next: () => Promise<void>) {

        var authorization = ctx.request.header('Authorization');
        // console.log(`-> ${request.header('Authorization')} `)

        if (!authorization) {
            return ctx.response.unauthorized({
                code: 0,
                error: 'Not authenticated',
                status: 403,
            });
        }

        const token = authorization.split(' ')[1]

        var parsedToken
        try {
            // Varify if its the right Token that created by JWT and decoded it.
            const decodedToken = jwt.verify(token, 'SECRET');
            var parsedToken = JSON.parse(JSON.stringify(decodedToken))
            console.log(parsedToken.phoneNumber);

        } catch (error) {
            return ctx.response.status(500).send({
                code: 0,
                message: 'Server error',
                data: error
            });
        }
       
        ctx.token = parsedToken.token
        ctx.userId = parsedToken.userId
        await next()
    }
}