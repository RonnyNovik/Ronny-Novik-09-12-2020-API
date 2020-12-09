/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/message/list', 'MessageController.getList').middleware(['auth'])
Route.post('/message/send', 'MessageController.sendMessage').middleware(['auth'])
Route.put('/message/read', 'MessageController.readMessage').middleware(['auth'])
Route.delete('/message/delete', 'MessageController.deleteMessage').middleware(['auth'])
