import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Otp from 'App/Models/Otp'
import User from 'App/Models/User'
import ResponseData from 'App/helper/ResposeData'
import otpGenerator from 'otp-generator'


export default class LoginController {
  public async sendOtp(ctx: HttpContextContract) {
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
  }

  public async confirmOtp(ctx: HttpContextContract) {
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

      const foundedUser = await User.firstOrCreate({ phone_number: foundOtp?.phone_number })


      const tokenData = await ctx.auth.use('api').generate(foundedUser, {
        expiresIn: '100 days'
      })

      return ctx.response.status(201).send(
        new ResponseData(
          1,
          ' User created successfully',
          { ...foundedUser.$original, token: tokenData.token },
        )

        //   {
        //   code: 1,
        //   message: 'User created successfully',
        //   data: { ...foundedUser.$original, token: tokenData.token},
        // }

      )

    } catch (error) {
      return ctx.response.status(500).send({
        code: 0,
        message: 'Server Error !',
        data: error,
      })
    }
  }
}
