const socket = io()

socket.on('welcome', () => {
    console.log('Welcome, buddy!')
})

function draftCard() {
    var card_id = event.target.value || event.target.parentNode.value
    socket.emit('draftCard', card_id)
}