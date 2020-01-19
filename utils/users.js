const users = []

const addUser = ({ id, lobby }) => {

    if (!lobby) {
        return {
            error: 'Lobby is required.'
        }
    }

    const user = { id, lobby }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)
    }
}

const getUsersInLobby = (lobby) => {
    return users.filter((user) => user.lobby === lobby)
}

module.exports = {
    addUser,
    removeUser,
    getUsersInLobby
}