/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/users/sign-in', 'UserController.signIn')
Route.post('/users/sign-up', 'UserController.signUp')
