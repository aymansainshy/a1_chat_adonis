import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import Otp from 'App/Models/Otp'
import User from 'App/Models/User'
import ResponseData from 'App/helper/ResposeData'
import otpGenerator from 'otp-generator'
import axios from 'axios'

const SENDER_ID = Env.get('SENDER_ID');
const PASSWORD = Env.get('PASSWORD');
const USER_NAME = Env.get('USER_NAME');

export default class LoginController {
  public async sendOtp(ctx: HttpContextContract) {
    try {
      const searchedPylod = { phone_number: ctx.request.input('phone_number') }
      const phoneNumber = ctx.request.input('phone_number')


      const generatedOtp: string = otpGenerator.generate(5, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      })

      const savedOtp = await Otp.updateOrCreate(searchedPylod, { otp: generatedOtp })

      const url = `http://sms.nilogy.com/app/gateway/gateway.php?sendmessage=1&username=${USER_NAME}&password=${PASSWORD}&text=${generatedOtp}&numbers=${phoneNumber}&sender=${SENDER_ID}`

      await axios.get(url)

      return ctx.response.created({
        code: 1,
        message: 'Otp created succefully1',
        data: savedOtp
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
    const phoneNumber = ctx.request.input('phone_number')
    const otp = ctx.request.input('otp')

    try {
      const foundOtp = await Otp.findBy('phone_number', phoneNumber)

      if (!foundOtp || otp !== foundOtp?.otp?.toString()) {
        return ctx.response.status(404).send({
          code: 0,
          message: 'Invalid otp !',
          data: {},
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
