import socketContainer from 'App/helper/OnlineUserContainer'
import Ws from '../app/Services/Ws'
Ws.boot()


let container = socketContainer();

/**
 * Listen for incoming socket connections
 */

Ws.io?.on('connection', (socket) => {

  
  socket.on('user-data' , (data) => {
    container.set( data.user.id , {...data.user, socketId: socket.id })

    console.log(socket.id)
    // console.log(container);

    socket.broadcast.emit('online-user', container.get(data.user.id))
  })

  socket.on('send-message', (data) => {

    console.log(data)
    console.log(data.sender.phoneNumber)
    
    const user = container.get(data.receiver.id)
    
    console.log(user.socketId)
    socket.to(user.socketId).emit('message', data)
  })


  socket.on('disconnected-user-data', (user) => {
    console.log('DisConnected.....')
    console.log(user)
    
    container.delete(user.id);
  })


  socket.on('disconnect' ,() => {
    console.log('DisConnected')
  })
})
