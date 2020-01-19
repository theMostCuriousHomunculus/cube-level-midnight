const socket = io()

socket.on('welcome', () => {
    console.log('Welcome, buddy!')
})