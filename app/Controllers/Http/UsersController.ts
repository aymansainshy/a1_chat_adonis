import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginController from './LoginController';
import otpGenerator from 'otp-generator'
import Otp from 'App/Models/Otp';
export default class UsersController {
    loginController: LoginController = new LoginController()

    public async updateUserName(ctx: HttpContextContract) {
        try {
            const user = await User.findOrFail(ctx.params.id)

            if (!user) {
                return ctx.response.status(404).send({
                    code: 0,
                    message: 'user not found !',
                    data: []
                });
            }

            var isAuthorized = ctx.userId?.toString() === user.id.toString() ;
    
            if (!isAuthorized) {
                const error = new Error('Not Authorized !')
                return ctx.response.unauthorized({
                    code: 0,
                    error: 'Not Authorized !',
                    data: error,
                });
            }

            user.name = ctx.request.input('name')
            const updatedUser = await user.save()

            return ctx.response.status(203).send({
                code: 1,
                message: 'User updated successfully !',
                data: updatedUser
            })

        } catch (error) {
            return ctx.response.status(500).send({
                code: 0,
                message: 'Server error !',
                data: []
            });
        }
    }

    public async updataPhone(ctx: HttpContextContract) {
        try {
            const searchPayload = { phone_number: ctx.request.input('phone_number') }

            const generatedOtp: string = otpGenerator.generate(5, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            })

            console.log(generatedOtp)

            const savedOtp = await Otp.updateOrCreate(searchPayload, { otp: generatedOtp })
            return ctx.response.created({
                code: 1,
                message: 'Otp created succefully',
                data: savedOtp,
            })


        } catch (error) {
            return ctx.response.status(500).send({
                code: 0,
                message: 'Server error !',
                data: error
            });
        }
    }


    public async confirmUpdatePhone(ctx: HttpContextContract) {
        const phoneNumber = ctx.request.input('phone_number')
        const otp = ctx.request.input('otp')

        try {
            const foundOtp = await Otp.findBy('phone_number', phoneNumber)

            if (!foundOtp || otp !== foundOtp?.otp?.toString()) {
                return ctx.response.status(404).send({
                    code: 0,
                    message: 'Invalid otp !',
                    data: [],
                })
            }
           
            var isAuthorized = ctx.userId?.toString() === ctx.params.id.toString()

            if (!isAuthorized) {
                const error = new Error('Not Authorized !')
                return ctx.response.unauthorized({
                    code: 0,
                    error: 'Not Authorized !',
                    data: error,
                });
            }

            const user = await User.findOrFail(ctx.params.id)
            user.phone_number = foundOtp.phone_number
            const updatedUser = await user.save()

            return ctx.response.status(203).send({
                code: 1,
                message: 'User updated successfully !',
                data: updatedUser
            })

        } catch (error) {
            return ctx.response.status(500).send({
                code: 0,
                message: 'Server error !',
                data: []
            });
        }
    }
}

