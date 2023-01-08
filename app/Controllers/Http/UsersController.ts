import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginController from './LoginController';
import otpGenerator from 'otp-generator'
import Otp from 'App/Models/Otp';
export default class UsersController {
    loginController: LoginController = new LoginController()

    public async updateUserName({ request, response, params }: HttpContextContract) {
        try {
            console.log(params.id);
            const user = await User.findOrFail(params.id)

            if (!user) {
                return response.status(404).send({
                    code: 0,
                    message: 'user not found !',
                    data: []
                });
            }

            user.name = request.input('name')
            const updatedUser = await user.save()

            return response.status(203).send({
                code: 1,
                message: 'User updated successfully !',
                data: updatedUser
            })

        } catch (error) {
            return response.status(500).send({
                code: 0,
                message: 'Server error !',
                data: []
            });
        }
    }

    public async updataPhone({ request, response }: HttpContextContract) {
        try {
            const searchPayload = { phone_number: request.input('phone_number') }

            const generatedOtp: string = otpGenerator.generate(5, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            })

            console.log(generatedOtp)

            const savedOtp = await Otp.updateOrCreate(searchPayload, { otp: generatedOtp })
            return response.created({
                code: 1,
                message: 'Otp created succefully',
                data: savedOtp,
            })


        } catch (error) {
            return response.status(500).send({
                code: 0,
                message: 'Server error !',
                data: []
            });
        }
    }


    public async confirmUpdatePhone({ request, response, params }: HttpContextContract) {
        const phoneNumber = request.input('phone_number')
        const otp = request.input('otp')

        try {
            const foundOtp = await Otp.findBy('phone_number', phoneNumber)

            if (!foundOtp || otp !== foundOtp?.otp?.toString()) {
                return response.status(404).send({
                    code: 0,
                    message: 'Invalid otp !',
                    data: [],
                })
            }

            const user = await User.findOrFail(params.id)
            user.phone_number = foundOtp.phone_number
            const updatedUser = await user.save()

            return response.status(203).send({
                code: 1,
                message: 'User updated successfully !',
                data: updatedUser
            })

        } catch (error) {
            return response.status(500).send({
                code: 0,
                message: 'Server error !',
                data: []
            });
        }
    }
}

