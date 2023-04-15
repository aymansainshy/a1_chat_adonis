import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import otpGenerator from 'otp-generator'
import axios from 'axios'
import getSmsUrl from 'App/helper/SmsUrl'
import container from 'App/helper/otp_container'

let otpContainer = container()
export default class LoginController {
  public async sendOtp(ctx: HttpContextContract) {
    try {


      const phoneNumber = ctx.request.input('phone_number')

      const generatedOtp: string = otpGenerator.generate(5, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      })

      otpContainer.set(phoneNumber, {
        otp: generatedOtp,
        phoneNumber: phoneNumber,
      })

      const url = getSmsUrl(generatedOtp, phoneNumber)
      await axios.get(url)

      return ctx.response.created({
        code: 1,
        message: 'Otp created succefully1',
        data: generatedOtp
      })

    } catch (error) {
      return ctx.response.status(500).send({
        code: 0,
        message: 'Server error !',
        data: error
      });
    }
  }

  public async confirmOtp(ctx: HttpContextContract) {
    const phoneNumber: string = ctx.request.input('phone_number')
    const otp: string = ctx.request.input('otp')

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

      const foundedUser = await User.firstOrCreate({ phone_number: foundOtp?.phoneNumber })

      const tokenData = await ctx.auth.use('api').generate(foundedUser, {
        expiresIn: '100 days'
      })

      return ctx.response.status(201).send({
        code: 1,
        message: 'User created successfully',
        data: { ...foundedUser.$original, token: tokenData.token },
      })

    } catch (error) {
      return ctx.response.status(500).send({
        code: 0,
        message: 'Server Error !',
        data: error,
      })
    }
  }
}
