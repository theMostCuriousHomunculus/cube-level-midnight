const express = require('express')
const Cube = require('../models/cube-model')
const User = require('../models/user-model')
const authentication = require('../middleware/authentication')
const router = new express.Router()


// takes you to the draft page
router.get('/draft', authentication, async (req, res) => {

    const cubes = await Cube.findByCreator(req.user._id)

    res.render('draft-home', {
        cubes: cubes,
        title: "Create or Join a Draft!"
    })
})

// currently just displays a random pack based on your selections; eventually this route should actually start a draft with socket.io
router.post('/draft/create-draft', async (req, res) => {

    const cube = await Cube.findById(req.body.cube_to_draft)
    let draftPool = cube.main_board

    cube.modules.forEach(function(x) {
        if (req.body["modules[]"] && req.body["modules[]"].includes(x._id.toString())) {
            draftPool = draftPool.concat(x.cards)
        }
    })

    function randomSample(array, sampleSize) {
        let sampleArray = []
        let randomNumber = 0
        let randomCard = {}

        for (index = 0; index < sampleSize; index++) {
            randomNumber = Math.floor(Math.random()*array.length)
            randomCard = array[randomNumber]

            while (sampleArray.includes(randomCard)) {
                randomNumber = Math.floor(Math.random()*array.length)
                randomCard = array[randomNumber]
            }
            sampleArray[index] = randomCard
        }
        
        return sampleArray
    }

    cube.rotations.forEach(function(rotation) {
        draftPool = draftPool.concat(randomSample(rotation.cards, rotation.size))
    })

    const randomPack = randomSample(draftPool, req.body.cards_per_pack)

    res.render('draft-lobby', {
        cards: randomPack,
        lobby_name: req.body.draft_name,
        title: "Choose a Card!"
    })

    const io = req.app.get("io")
    io.on('connection', (socket) => {
        console.log("New WebSocket connection!")

        socket.emit('welcome')
    })
})

module.exports = router