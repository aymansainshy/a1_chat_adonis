import socketContainer from 'App/helper/OnlineUserContainer'
import Ws from '../app/Services/Ws'
Ws.boot()


let onlineUser = socketContainer();


Ws.io?.on('connection', (socket) => {

  socket.on('user-connected', (data) => {
    onlineUser.set(data.user.phoneNumber, { ...data.user, socketId: socket.id })

    socket.broadcast.emit('user-connected', onlineUser.get(data.user.phoneNumber))

    // Fetch messed event releated to connected user.
  })




  socket.on('send-text-message', (data) => {
    const receiver = onlineUser.get(data.receiver.phoneNumber)

    socket.emit('message-success', data)

    if (!receiver) {
      // Save message to Redis Storage - receiver well pull messages later .
      return
    }
    socket.to(receiver.socketId).emit('send-text-message', data)
  })




  socket.on('message-delivered', (data) => {
    if (!data) {
      return
    }

    const sender = onlineUser.get(data.sender.phoneNumber)

    if (!sender) {
      // Save message status to Redis Storage - sender well pull messages status later .
      return
    }

    socket.to(sender.socketId).emit('message-delivered', data)
  })




  socket.on('iread-message', (data) => {
    if (!data) {
      return
    }
    
    const sender = onlineUser.get(data.sender.phoneNumber)

    if (!sender) {
      // Save message status to Redis Storage - sender well pull messages status later .
      return
    }
   
    socket.to(sender.socketId).emit('message-read', data)
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
