import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'

export default class AuthMiddlware {
    public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {

        var authorization = request.header('Authorization');
        // console.log(`-> ${request.header('Authorization')} `)

        if (!authorization) {
            return response.unauthorized({
                code: 0,
                error: 'Un authorized !',
                status: 403,
            });
        }

        const token = authorization.split(' ')[1]
        var theToken
        try {
            // Varify if its the right Token that created by JWT and decoded it.
            const decodedToken = jwt.verify(token, 'SECRET');
            var theToken = JSON.parse(JSON.stringify(decodedToken))
            console.log(theToken.phoneNumber);

        } catch {
            const error = new Error("Not authenticated")
            throw error;
        }

        await next()
    }
}