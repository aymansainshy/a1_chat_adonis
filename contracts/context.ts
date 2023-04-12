declare module '@ioc:Adonis/Core/HttpContext' {
  
    interface HttpContextContract {
      token: string | null
      userId: string | null
    }
  }