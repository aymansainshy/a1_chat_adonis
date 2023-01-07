import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Otp from 'App/Models/Otp'
import User from 'App/Models/User'
import otpGenerator from 'otp-generator'

export default class LoginController {
  public async sendOtp({ request, response }: HttpContextContract) {
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
  }

  public async confirmOtp({ request, response }: HttpContextContract) {
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

      const foundedUser = await User.firstOrCreate({ phone_number: foundOtp?.phone_number })

      return response.status(201).send({
        code: 1,
        message: 'User created successfully',
        data: foundedUser,
      })
    } catch (error) {
      return response.status(500).send({
        code: 0,
        message: 'Server Error !',
        data: [],
      })
    }
  }
}
