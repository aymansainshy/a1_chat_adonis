import socketContainer from 'App/helper/OnlineUserContainer'
import Ws from '../app/Services/Ws'
Ws.boot()


let container = socketContainer();

/**
 * Listen for incoming socket connections
 */

Ws.io?.on('connection', (socket) => {


  socket.on('user-data', (data) => {
    container.set(data.user.phoneNumber, { ...data.user, socketId: socket.id })

    console.log(socket.id)
    // console.log(container);
    socket.broadcast.emit('online-user', container.get(data.user.phoneNumber))
  })




  socket.on('send-message', (data) => {
    const receiver = container.get(data.receiver.phoneNumber)
    // const sender = container.get(data.sender.phoneNumber)

    socket.emit('message-success', data)

    if(!receiver){
      return
    }
    socket.to(receiver.socketId).emit('message', data)
  })




  socket.on('message-delivered', (data) => {
    if (!data) {
      return
    }
    console.log("message Deliverd");
    console.log(data)
    console.log(data.sender.phoneNumber)
    const sender = container.get(data.sender.phoneNumber)
    if (!sender) {
      return
    }

    // const receiver = container.get(data.receiver.phoneNumber)

    // console.log(receiver.socketId)

    socket.to(sender.socketId).emit('message-delivered', data)
  })



  
  socket.on('iread-message', (data) => {
    if (!data) {
      return
    }
    console.log("message-read");
    console.log(data.senderPhone)
    console.log(data.recieverPhone)

    // const sender = container.get(data.sender.phoneNumber)
    const receiver = container.get(data.recieverPhone)

    if (!receiver) {
      return
    }
    // console.log(receiver.socketId)
    socket.to(receiver.socketId).emit('message-read', data.senderPhone)
  })




  socket.on('disconnected-user-data', (user) => {
    console.log('DisConnected.....')
    console.log(user)

    container.delete(user.id);
  })



  socket.on('disconnect', () => {
    console.log('DisConnected')
  })
})
