const express = require('express')
const { Cube } = require('../models/cube-model')
const { Lobby } = require('../models/lobby-model')
const User = require('../models/user-model')
const authentication = require('../middleware/authentication')
const asyncForEach = require('../utils/async-forEach')
const { colorSort } = require('../utils/card-sort')
const router = new express.Router()

// takes you to the draft homepage
router.get('/draft', authentication, async (req, res) => {

    const cubes = await Cube.findByCreator(req.user._id)
    var buddies = req.user.buds

    await asyncForEach(buddies, async (bud) => {
        var user = await User.findById(bud._id)
        bud.account_name = user.account_name
        bud.avatar = user.avatar
    })

    res.render('draft-home', {
        buddies: buddies,
        cubes: cubes,
        title: "Create or Join a Draft!",
        user_id: req.user._id
    })

})

// currently just displays a random pack based on your selections; eventually this route should create a new draft
router.post('/draft/create-lobby', authentication, async (req, res) => {

    const cardsPerPack = req.body.cards_per_pack
    const numberOfPacks = req.body.number_of_packs
    const cube = await Cube.findById(req.body.cube_to_draft)
    let cardpool = cube.main_board

    cube.modules.forEach(function(x) {
        if (req.body["modules[]"] && req.body["modules[]"].includes(x._id.toString())) {
            cardpool = cardpool.concat(x.cards)
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
        cardpool = cardpool.concat(randomSample(rotation.cards, rotation.size))
    })

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let dummy = array[i]
            array[i] = array[j]
            array[j] = dummy
            // [array[i], array[j]] = [array[j], array[i]]
        }
    }

    shuffle(cardpool)

    let drafters = [{ drafter_id: req.user._id, queue: [], packs: [], picks: [] }]

    // no buds, multiple buds or a single bud
    if (!req.body["buds[]"]) {
        
    } else if (Array.isArray(req.body["buds[]"])) {
        req.body["buds[]"].forEach(function(bud) {
            drafters.push({ drafter_id: bud, queue: [], packs: [], picks: [] })
        })
    } else {
        drafters.push({ drafter_id: req.body["buds[]"], queue: [], packs: [], picks: [] })
    }

    shuffle(drafters)

    const numberOfDrafters = drafters.length

    // dish out packs to drafters
    for (let i = 0; i < numberOfDrafters; i++) {
        for (let j = 0; j < numberOfPacks; j++) {
            drafters[i].packs.push(cardpool.splice(0, cardsPerPack))
        }
    }

    const lobby = new Lobby({
        lobby_name: req.body.lobby_name,
        host: req.user._id,
        drafters: drafters
    })

    await lobby.save()

    res.redirect('/draft/join-lobby?lobby_name=' + req.body.lobby_name + '&user_id=' + req.user._id)

})

router.get('/draft/join-lobby', authentication, async (req, res) => {

    const lobby = await Lobby.findOne({ lobby_name: req.query.lobby_name })

    if (!lobby) {
        res.status(404).render('error', {
            error: "That lobby doesn't exist.",
            title: "Error"
        })
    }

    let drafters = []
    lobby.drafters.forEach(function(drafter) {
        drafters.push(drafter.drafter_id.toString())
    })

    if (!drafters.includes(req.query.user_id)) {
        res.status(401).render('error', {
            error: "You were not invited to that lobby.",
            title: "Error"
        })
    }

    const drafterIndex = drafters.indexOf(req.query.user_id)

    await asyncForEach(lobby.drafters, async (drafter) => {
        var user = await User.findById(drafter.drafter_id)
        drafter.account_name = user.account_name
        drafter.avatar = user.avatar
    })

    // check to see if the lobby is ready for the next pack or if at least one drafter still needs to make a pick
    let nextPack = 1

    for (let i = 0; i < lobby.drafters.length; i++) {
        if (lobby.drafters[i].queue.length === 0 || lobby.drafters[i].queue[0].length === 0) {
            nextPack = nextPack * 1
        } else {
            nextPack = nextPack * 0
        }
    }

    if (nextPack === 1 && lobby.drafters[drafterIndex].packs.length === 0) {
        // the drafter has made all of his picks and can now begin to build his deck
        res.render('draft-lobby', {
            drafters: lobby.drafters,
            finished: true,
            message: "Your picks:",
            refresh: false,
            selections_as_color_arrays: colorSort(lobby.drafters[drafterIndex].picks),
            title: lobby.lobby_name
        })
    } else if (nextPack === 1) {
        // ready to start a new round of packs
        for (let i = 0; i < lobby.drafters.length; i++) {
            lobby.drafters[i].queue.shift()
            lobby.drafters[i].queue.push(lobby.drafters[i].packs[0])
            lobby.drafters[i].packs.shift()
        }
        await lobby.save()
        res.render('draft-lobby', {
            cards: lobby.drafters[drafterIndex].queue[0],
            drafters: lobby.drafters,
            finished: false,
            message: "Choose a card!",
            refresh: false,
            title: lobby.lobby_name
        })
    } else if (nextPack === 0 && lobby.drafters[drafterIndex].queue.length === 0) {
        // the drafter who passes their pack to this drafter has not made a pick yet
        res.render('draft-lobby', {
            cards: [],
            drafters: lobby.drafters,
            finished: false,
            message: "Other drafters are still making their picks.  Yell at them to hurry up!",
            refresh: true,
            title: lobby.lobby_name
        })
    } else {
        // there is a pack in the drafter's queue that they can go ahead and make a pick from
        res.render('draft-lobby', {
            cards: lobby.drafters[drafterIndex].queue[0],
            drafters: lobby.drafters,
            finished: false,
            message: "Choose a card!",
            refresh: false,
            title: lobby.lobby_name
        })
    }    
})

router.post('/draft/draft-card', authentication, async (req, res) => {

    const lobby = await Lobby.findOne({ lobby_name: req.body.lobby_name })
    
    let drafters = []
    lobby.drafters.forEach(function(drafter) {
        drafters.push(drafter.drafter_id.toString())
    })
    const drafterIndex = drafters.indexOf(req.body.user_id)

    let cardIds = []
    lobby.drafters[drafterIndex].queue[0].forEach(function(card) {
        cardIds.push(card._id.toString())
    })
    const cardIndex = cardIds.indexOf(req.body.card_id)

    // remove the drafter's pick from the "pack" and add it to his picks array
    lobby.drafters[drafterIndex].picks.push(lobby.drafters[drafterIndex].queue[0].splice(cardIndex, 1)[0])

    // remove the remaining cards in the "pack" from that drafter's queue and send the "pack" to the next drafter's queue
    if (drafterIndex === lobby.drafters.length - 1) {
        lobby.drafters[0].queue.push(lobby.drafters[drafterIndex].queue[0])
        lobby.drafters[drafterIndex].queue.shift()
    } else {
        lobby.drafters[drafterIndex + 1].queue.push(lobby.drafters[drafterIndex].queue[0])
        lobby.drafters[drafterIndex].queue.shift()
    }

    await lobby.save()
    res.status(202).send()
})

module.exports = router