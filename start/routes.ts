/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('/', 'LoginController.sendOtp')
  Route.post('/confirmotp', 'LoginController.confirmOtp')
}).prefix('/login')

Route.group(() => {
  Route.put('/updatename/:id', 'UsersController.updateUserName')
  Route.put('/update-phone/:id', 'UsersController.updataPhone')
  Route.put('/confirm-mupdate-phone/:id', 'UsersController.confirmUpdatePhone')
}).prefix('/user').middleware('isUserAuthorized')

