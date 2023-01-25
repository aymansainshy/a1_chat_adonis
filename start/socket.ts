import socketContainer from 'App/helper/OnlineUserContainer'
import Ws from '../app/Services/Ws'
Ws.boot()


let onlineUser = socketContainer();

/**
 * Listen for incoming socket connections
 */

Ws.io?.on('connection', (socket) => {

  socket.on('user-data', (data) => {
    onlineUser.set(data.user.phoneNumber, { ...data.user, socketId: socket.id })

    socket.broadcast.emit('online-user', onlineUser.get(data.user.phoneNumber))
  })




  socket.on('send-message', (data) => {
    const receiver = onlineUser.get(data.receiver.phoneNumber)
    // const sender = onlineUser.get(data.sender.phoneNumber)

    socket.emit('message-success', data)

    if (!receiver) {
      return
    }
    socket.to(receiver.socketId).emit('message', data)
  })




  socket.on('message-delivered', (data) => {
    if (!data) {
      return
    }

    const sender = onlineUser.get(data.sender.phoneNumber)

    if (!sender) {
      return
    }

    socket.to(sender.socketId).emit('message-delivered', data)
  })




  socket.on('iread-message', (data) => {
    if (!data) {
      return
    }
    console.log("message-read");
    console.log(data.senderPhone)
    console.log(data.recieverPhone)

    // const sender = onlineUser.get(data.sender.phoneNumber)
    const receiver = onlineUser.get(data.recieverPhone)

    if (!receiver) {
      return
    }
    // console.log(receiver.socketId)
    socket.to(receiver.socketId).emit('message-read', data.senderPhone)
  })




  socket.on('disconnected-user-data', (user) => {
    console.log('DisConnected.....')
    console.log(user)

    onlineUser.delete(user.id);
  })



  socket.on('disconnect', () => {
    console.log('DisConnected')
  })
})
