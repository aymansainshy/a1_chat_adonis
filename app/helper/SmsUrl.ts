import Env from '@ioc:Adonis/Core/Env'

const SENDER_ID = Env.get('SENDER_ID');
const PASSWORD = Env.get('PASSWORD');
const USER_NAME = Env.get('USER_NAME');


export default function getSmsUrl(otp: string, phone: string): string {
    const url = `http://sms.nilogy.com/app/gateway/gateway.php?sendmessage=1&username=${USER_NAME}&password=${PASSWORD}&text=${otp}&numbers=${phone}&sender=${SENDER_ID}`
    return url
}