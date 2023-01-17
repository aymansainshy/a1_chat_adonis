import Ws from '../app/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */

Ws.io?.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' })

  socket.on('send-message', (data) => {
    console.log(data.content)
    console.log(data.sender.phoneNumber)
  })
})
