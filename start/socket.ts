import socketContainer from 'App/helper/OnlineUserContainer'
import Ws from '../app/Services/Ws'
import MessagesController from 'App/Controllers/Http/MessagesController';
Ws.boot()


let onlineUser = socketContainer();

const messagesController = new MessagesController()


Ws.io?.on('connection', (socket) => {
  console.log('User Connected ....')

  socket.on('user-connected', async (data) => {
    onlineUser.set(data.user.phone_number, { ...data.user, socketId: socket.id })

    socket.broadcast.emit('user-connected', onlineUser.get(data.user.phone_number))
  })




  socket.on('send-message', async (message) => {
    const receiver = onlineUser.get(message.receiver.phone_number)

    socket.emit('message-success', message)

    if (!receiver) {
      // Save message to DB Storage - receiver well pull messages later .
      message.is_success = true
      await messagesController.saveMessage(message)
      return
    }
    socket.to(receiver.socketId).emit('send-text-message', message)
  })




  socket.on('message-delivered', async (message) => {
    if (!message) {
      return
    }
    const sender = onlineUser.get(message.sender.phone_number)

    if (!sender) {
      // Save message status to Redis Storage - sender well pull messages status later .
      await messagesController.saveMessage(message)
      return
    }

    socket.to(sender.socketId).emit('message-delivered', message)
  })




  socket.on('iread-message', async (message) => {
    if (!message) {
      return
    }
    const sender = onlineUser.get(message.sender.phone_number)

    if (!sender) {
      // Save message status to Redis Storage - sender well pull messages status later .
      await messagesController.saveMessage(message)
      return
    }

    socket.to(sender.socketId).emit('message-read', message)
  })




  socket.on('disconnect', () => {

    var users = Array.from(onlineUser.values())

    const index = users.findIndex(user => user.socketId == socket.id);

    let disConnectedUser

    if (index !== -1) {
      onlineUser.delete(users[index].phone_number)
      disConnectedUser = users.splice(index, 1)[0];
    }

    Ws.io?.emit('disconnected-user', disConnectedUser)
  })
})
