import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginController from './LoginController'

import container from 'App/helper/otp_container'

let otpContainer = container()
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

            var isAuthenticated = ctx.auth.isAuthenticated
            var isAuthorized = ctx.auth.user?.id == ctx.params.id

            if (!isAuthenticated || !isAuthorized) {
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
                data: {}
            });
        }
    }

    public async updataPhone(ctx: HttpContextContract) {
        return this.loginController.sendOtp(ctx)
    }


    public async confirmUpdatePhone(ctx: HttpContextContract) {
        const phoneNumber = ctx.request.input('phone_number')
        const otp = ctx.request.input('otp')

        try {

            let foundOtp

            if (otpContainer.has(phoneNumber)) {
                foundOtp = otpContainer.get(phoneNumber)
                otpContainer.delete(phoneNumber)

            } else {
                return ctx.response.status(404).send({
                    code: 0,
                    message: 'Invalid otp !',
                    data: {},
                })
            }

            if (otp !== foundOtp.otp) {
                return ctx.response.status(404).send({
                    code: 0,
                    message: 'Invalid otp !',
                    data: {},
                })
            }
            // const foundOtp = await Otp.findBy('phone_number', phoneNumber)

            // if (!foundOtp || otp !== foundOtp?.otp?.toString()) {
            //     return ctx.response.status(404).send({
            //         code: 0,
            //         message: 'Invalid otp !',
            //         data: [],
            //     })
            // }

            var isAuthenticated = ctx.auth.isAuthenticated
            var isAuthorized = ctx.auth.user?.id == ctx.params.id

            if (!isAuthenticated || !isAuthorized) {
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
                data: error
            });
        }
    }



    public async updateImge(ctx: HttpContextContract) {
        try {
            var isAuthenticated = ctx.auth.isAuthenticated
            var isAuthorized = ctx.auth.user?.id == ctx.params.id

            // console.log(isAuthenticated)
            // console.log(isAuthorized)

            if (!isAuthenticated || !isAuthorized) {
                const error = new Error('Not Authorized !')
                return ctx.response.unauthorized({
                    code: 0,
                    error: 'Not Authorized !',
                    data: error,
                });
            }

            const image = ctx.request.file('image', {
                size: '2mb',
                extnames: ['jpg', 'png', 'gif', 'jpeg'],
            })

            const user = await User.findOrFail(ctx.params.id)


            if (!image) {
                return ctx.response.status(410).send({
                    code: 0,
                    message: 'Invalid image!',
                    data: {}
                });
            }

            if (!image.isValid) {
                return ctx.response.status(413).send({
                    code: 0,
                    message: 'image error !',
                    data: image.errors
                });
            }


            if (image) {
                // await image.move(Application.tmpPath('uploads'))
                // console.log(`File name ->  ${image?.fieldName}`);

                await image.moveToDisk('./')

                user.image_Url = image?.fileName
                const updatedUser = await user.save()

                return ctx.response.status(203).send({
                    code: 1,
                    message: 'Image updated successfully !',
                    data: updatedUser
                })
            }

        } catch (error) {
            console.log(error);
            return ctx.response.status(500).send({
                code: 0,
                message: 'Server error !',
                data: error
            });
        }
    }
}

