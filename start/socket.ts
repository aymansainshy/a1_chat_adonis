import socketContainer from 'App/helper/OnlineUserContainer'
import Ws from '../app/Services/Ws'
import MessagesController from 'App/Controllers/Http/MessagesController';
Ws.boot()


let onlineUser = socketContainer();

const messagesController = new MessagesController()


Ws.io?.on('connection', (socket) => {

  socket.on('user-connected', (data) => {
    onlineUser.set(data.user.phoneNumber, { ...data.user, socketId: socket.id })

    socket.broadcast.emit('user-connected', onlineUser.get(data.user.phoneNumber))

    // Fetch messed event releated to connected user.
  })




  socket.on('send-text-message', async (message) => {
    const receiver = onlineUser.get(message.receiver.phoneNumber)

    socket.emit('message-success', message)

    if (!receiver) {
      // Save message to DB Storage - receiver well pull messages later .
      await messagesController.saveMessage(message)
      return
    }
    socket.to(receiver.socketId).emit('send-text-message', message)
  })




  socket.on('message-delivered', (message) => {
    if (!message) {
      return
    }

    const sender = onlineUser.get(message.sender.phoneNumber)

    if (!sender) {
      // Save message status to Redis Storage - sender well pull messages status later .
      return
    }

    socket.to(sender.socketId).emit('message-delivered', message)
  })




  socket.on('iread-message', (message) => {
    if (!message) {
      return
    }

    const sender = onlineUser.get(message.sender.phoneNumber)

    if (!sender) {
      // Save message status to Redis Storage - sender well pull messages status later .
      return
    }

    socket.to(sender.socketId).emit('message-read', message)
  })




  socket.on('disconnect', () => {

    var users = Array.from(onlineUser.values())

    const index = users.findIndex(user => user.socketId == socket.id);

    let disConnectedUser

    if (index !== -1) {
      onlineUser.delete(users[index].phoneNumber)
      disConnectedUser = users.splice(index, 1)[0];
    }

    Ws.io?.emit('disconnected-user', disConnectedUser)
  })
})
