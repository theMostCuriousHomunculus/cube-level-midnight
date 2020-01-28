const express = require('express')
const { colorSort, alphabeticalSort } = require('../utils/card-sort')
const { Cube } = require('../models/cube-model')
const authentication = require('../middleware/authentication')
const creatorAccess = require('../middleware/creator-access')
const router = new express.Router()

// create a new cube
router.post('/cubes/create', authentication, async (req, res) => {

    try {
        const cube = new Cube({
            cube_name: req.body.cube_name,
            cube_description: req.body.cube_description,
            cube_creator: req.user._id
        })

        await cube.save()
        res.status(201).redirect('/cubes/view-cube?cube_id=' + cube._id + '&cube_component=main_board')
    } catch(error) {
        res.status(400).redirect('/cubes/my-cubes')
    }
})

// view existing cubes
router.get('/cubes/my-cubes', authentication, async (req, res) => {
    
    const cubes = await Cube.findByCreator(req.user._id)

    res.render('my-cubes', {
        cubes: cubes,
        title: "My Cubes"
    })
})

// return the components of a cube (used when a user selects a cube to draft)
router.get('/cubes/find-cube-components', creatorAccess, async (req, res) => {
    
    var moduleProjection = []
    req.cube.modules.forEach(function(x) {
        moduleProjection.push({
            _id: x._id,
            module_name: x.module_name
        })
    })
    res.status(202).send(moduleProjection)
})

// view an existing cube
router.get('/cubes/view-cube', creatorAccess, async (req, res) => {
    
    var component
    var component_id = req.query.cube_component
    var componentName
    var main_board_selected

    const displayComponent = new Promise((resolve, reject) => {
        try {
            if (component_id === "main_board") {
                component = req.cube.main_board
                componentName = "Main Board"
                main_board_selected = true
            } else if (req.cube.modules.id(component_id)){
                component = req.cube.modules.id(component_id).cards
                componentName = req.cube.modules.id(component_id).module_name
            } else if (req.cube.rotations.id(component_id)) {
                component = req.cube.rotations.id(component_id).cards
                componentName = req.cube.rotations.id(component_id).rotation_name
            } else {
                throw new Error
            }

            req.cube.modules.forEach(function (x) {
                if (x._id == component_id) {
                    x.selected = true
                } else {
                    x.selected = false
                }
            })

            req.cube.rotations.forEach(function (x) {
                if (x._id == component_id) {
                    x.selected = true
                } else {
                    x.selected = false
                }
            })

            resolve()
        } catch {
            reject("Something went wrong.  Try again later.")
        }
    })

    displayComponent.then((result) => {
        
        const { colorless_cards, white_cards, blue_cards, black_cards, red_cards, green_cards, azorius_cards, boros_cards, dimir_cards, izzet_cards, golgari_cards, gruul_cards, orzhov_cards, rakdos_cards, selesnya_cards, simic_cards, abzan_cards, bant_cards, esper_cards, grixis_cards, jeskai_cards, jund_cards, mardu_cards, naya_cards, sultai_cards, temur_cards, WUBR_cards, WUBG_cards, WURG_cards, WBRG_cards, UBRG_cards, WUBRG_cards } = colorSort(component)

        const multiColorCount = azorius_cards.length + boros_cards.length + dimir_cards.length + golgari_cards.length + gruul_cards.length + izzet_cards.length + orzhov_cards.length + rakdos_cards.length + selesnya_cards.length + simic_cards.length + abzan_cards.length + bant_cards.length + esper_cards.length + grixis_cards.length + jeskai_cards.length + jund_cards.length + mardu_cards.length + naya_cards.length + sultai_cards.length + temur_cards.length + WUBR_cards.length + WUBG_cards.length + WURG_cards.length + WBRG_cards.length + UBRG_cards.length + WUBRG_cards.length

        res.render('view-cube', {
            component_name: componentName,
            creator_access,
            cube_component: component_id,
            cube_description: req.cube.cube_description,
            cube_id: req.cube._id,
            cube_name: req.cube.cube_name,
            main_board_selected: main_board_selected,
            modules: req.cube.modules,
            multicolor_count: multiColorCount,
            rotations: req.cube.rotations,
            title: "View Cube",
            colorless_cards, white_cards, blue_cards, black_cards, red_cards, green_cards, azorius_cards, boros_cards, dimir_cards, izzet_cards, golgari_cards, gruul_cards, orzhov_cards, rakdos_cards, selesnya_cards, simic_cards, abzan_cards, bant_cards, esper_cards, grixis_cards, jeskai_cards, jund_cards, mardu_cards, naya_cards, sultai_cards, temur_cards, WUBR_cards, WUBG_cards, WURG_cards, WBRG_cards, UBRG_cards, WUBRG_cards
        })
    }).catch((error) => {
        res.status(404).send(error)
    })

})

// takes you to the page where you can edit an existing cube
router.get('/cubes/edit-cube', creatorAccess, async (req, res) => {

    var component
    var component_id = req.query.cube_component
    var component_name
    var deleteOption = true
    var mainBoardSelected = false
    var limit = parseInt(req.query.limit)
    var skip = parseInt(req.query.skip)

    const displayComponent = new Promise((resolve, reject) => {
        
        try {
            if (component_id === "main_board") {
                deleteOption = false
                component = req.cube.main_board
                mainBoardSelected = true
                component_name = "Main Board"
            } else if (req.cube.modules.id(component_id)){
                component = req.cube.modules.id(component_id).cards
                component_name = req.cube.modules.id(component_id).module_name
            } else if (req.cube.rotations.id(component_id)) {
                component = req.cube.rotations.id(component_id).cards
                component_name = req.cube.rotations.id(component_id).rotation_name
            } else {
                throw new Error
            }

            req.cube.modules.forEach(function (x) {
                if (x._id == component_id) {
                    x.selected = true
                } else {
                    x.selected = false
                }
            })

            req.cube.rotations.forEach(function (x) {
                if (x._id == component_id) {
                    x.selected = true
                } else {
                    x.selected = false
                }
            })

            resolve()
        } catch {
            reject("Something went wrong.  Try again later.")
        }
    })

    displayComponent.then((result) => {
        component.forEach(function (card) {
            if (card.color_identity.includes("W")) {
                card.W = "checked"
            } else {
                card.W = ""
            }
            if (card.color_identity.includes("U")) {
                card.U = "checked"
            } else {
                card.U = ""
            }
            if (card.color_identity.includes("B")) {
                card.B = "checked"
            } else {
                card.B = ""
            }
            if (card.color_identity.includes("R")) {
                card.R = "checked"
            } else {
                card.R = ""
            }
            if (card.color_identity.includes("G")) {
                card.G = "checked"
            } else {
                card.G = ""
            }
        })
        return component
    }).then((result) => {
        res.render('edit-cube', {
            component: alphabeticalSort(result).slice(limit*skip, limit*(1 + skip) - 1),
            component_name: component_name,
            cube_component: component_id,
            cube_description: req.cube.cube_description,
            cube_id: req.cube._id,
            cube_name: req.cube.cube_name,
            delete_option: deleteOption,
            main_board_selected: mainBoardSelected,
            max_pages: parseInt(component.length / limit) + 1,
            modules: req.cube.modules.sort(function (a, b) {
                var nameA = a.module_name.toUpperCase()
                var nameB = b.module_name.toUpperCase()
                if (nameA < nameB) {
                    return -1
                }
                if (nameA > nameB) {
                    return 1
                }
                return 0;
            }),
            optionA: limit === 25,
            optionB: limit === 50,
            optionC: limit === 100,
            page_number: skip + 1,
            rotations: req.cube.rotations.sort(function (a, b) {
                var nameA = a.rotation_name.toUpperCase()
                var nameB = b.rotation_name.toUpperCase()
                if (nameA < nameB) {
                    return -1
                }
                if (nameA > nameB) {
                    return 1
                }
                return 0;
            }),
            title: "Edit Cube"
        })
    }).catch((error) => {
        res.status(404).send(error)
    })
})

// change a component's name
router.post('/cubes/edit-cube/rename-component', creatorAccess, async (req, res) => {
    var componentNames = []
    const cubeToChange = req.cube
    var componentName
    
    if (req.body.component_type === "module") {
        cubeToChange.modules.forEach(function(x) {
            componentNames.push(x.module_name)
        })
    } else {
        cubeToChange.rotations.forEach(function(x) {
            componentNames.push(x.rotation_name)
        })
    }

    if (componentNames.includes(req.body.changed_component_name)) {
        if (req.body.component_type === "module") {
            componentName = cubeToChange.modules.id(req.body.cube_component).module_name 
        } else {
            componentName = cubeToChange.rotations.id(req.body.cube_component).rotation_name
        }
        res.status(406).send({ previous_component_name: componentName })
    } else {
        if (req.body.component_type === "module") {
            cubeToChange.modules.id(req.body.cube_component).module_name = req.body.changed_component_name
            cubeToChange.save()
        } else {
            cubeToChange.rotations.id(req.body.cube_component).rotation_name = req.body.changed_component_name
            cubeToChange.save()
        }
        res.status(202).send({ cube_id: req.cube._id, cube_component: req.body.cube_component })
    }
})

// change a cube's info
router.post('/cubes/edit-cube/change-cube-info', authentication, async (req, res) => {
    var cubeNames = []
    const cubeToChange = await Cube.findById(req.body.cube_id)
    const currentCubeName = cubeToChange.cube_name
    cubeToChange.cube_name = req.body.cube_id
    cubeToChange.cube_description = req.body.cube_description
    await cubeToChange.save()

    const cubes = await Cube.findByCreator(req.user._id)

    cubes.forEach(function(x) {
        cubeNames.push(x.cube_name)
    })

    if (cubeNames.includes(req.body.cube_name)) {
        cubeToChange.cube_name = currentCubeName
        await cubeToChange.save()
        res.status(406).send({ previous_cube_name: currentCubeName })
    } else {
        cubeToChange.cube_name = req.body.cube_name
        await cubeToChange.save()
        res.status(202).send({ previous_cube_name: req.body.cube_name })
    }
})

// check if a supplied module name already exists in that cube
router.post('/cubes/edit-cube/check-module-name', creatorAccess, async (req, res) => {
    var moduleNames = []
    req.cube.modules.forEach(function(x) {
        moduleNames.push(x.module_name)
    })

    if (moduleNames.includes(req.body.module_to_add)) {
        res.status(406).send()
    } else {
        res.status(202).send()
    }
})

// check if a supplied rotation name already exists in that cube
router.post('/cubes/edit-cube/check-rotation-name', creatorAccess, async (req, res) => {
    var rotationNames = []
    req.cube.rotations.forEach(function(x) {
        rotationNames.push(x.rotation_name)
    })

    if (rotationNames.includes(req.body.rotation_to_add)) {
        res.status(406).send()
    } else {
        res.status(202).send()
    }
})

// delete a cube component
router.post('/cubes/edit-cube/delete-component', creatorAccess, async (req, res) => {
    req.cube.modules.pull({
        _id: req.body.cube_component
    })
    req.cube.rotations.pull({
        _id: req.body.cube_component
    })
    await req.cube.save()
    res.redirect('/cubes/edit-cube?cube_id=' + req.cube._id + '&cube_component=main_board&limit=50&skip=0')
})

// add a module to the cube
router.post('/cubes/edit-cube/add-module', creatorAccess, async (req, res) => {
    req.cube.modules.push({
        module_name: req.body.module_to_add
    })
    await req.cube.save()
    var module_id = req.cube.modules[req.cube.modules.length - 1]._id
    res.redirect('/cubes/edit-cube?cube_id=' + req.cube._id + '&cube_component=' + module_id + '&limit=50&skip=0')
})

// add a rotation to the cube
router.post('/cubes/edit-cube/add-rotation', creatorAccess, async (req, res) => {
    req.cube.rotations.push({
        rotation_name: req.body.rotation_to_add,
        size: 1
    })
    await req.cube.save()
    // this returns the last subdocument's (rotation's) id in the array of rotations, since we used push to add the new rotation, the last subdocument id is the one we want
    var rotation_id = req.cube.rotations[req.cube.rotations.length - 1]._id
    res.redirect('/cubes/edit-cube?cube_id=' + req.cube._id + '&cube_component=' + rotation_id + '&limit=50&skip=0')
})

// add a card to a cube
router.post('/cubes/edit-cube/add-card', creatorAccess, async (req, res) => {

    const card = {
        name: req.body.card_to_add,
        oracle_id: req.body.oracle_id,
        type_line: req.body.type_line,
        mana_cost: req.body.mana_cost,
        cmc: req.body.cmc,
        color_identity: req.body["color_identity[]"],
        set: req.body.selected_printing.toLowerCase(),
        image: req.body.image,
        purchase_link: req.body.purchase_link
    }

    if (req.body.back_image) {
        card.back_image = req.body.back_image
    }

    if (req.body.power && isNaN(req.body.power)) {
        card.power = 0
    } else if (req.body.power) {
        card.power = req.body.power
    } else {

    }

    if (req.body.toughness && isNaN(req.body.toughness)) {
        card.toughness = 0
    } else if (req.body.toughness) {
        card.toughness = req.body.toughness
    } else {

    }

    if (req.body.loyalty && isNaN(req.body.loyalty)) {
        card.loyalty = 0
    } else if (req.body.loyalty) {
        card.loyalty = req.body.loyalty
    } else {

    }

    var component
    var component_id = req.body.cube_component

    if (component_id === "main_board") {
        component = req.cube.main_board
    } else if (req.cube.modules.id(component_id)){
        component = req.cube.modules.id(component_id).cards
    } else {
        component = req.cube.rotations.id(component_id).cards
    }

    component.push(card)
    await req.cube.save()
    res.redirect('/cubes/edit-cube?cube_id=' + req.cube._id + '&cube_component=' + component_id + '&limit=50&skip=0')
})

// change the color identity of a card in the cube
router.post('/cube/edit-cube/change-color-identity', creatorAccess, async (req, res) => {
    
    var component
    var component_id = req.body.cube_component

    if (component_id === "main_board") {
        component = req.cube.main_board
    } else if (req.cube.modules.id(component_id)){
        component = req.cube.modules.id(component_id).cards
    } else {
        component = req.cube.rotations.id(component_id).cards
    }
    
    var cardToChange = component.id(req.body.card_id)
    if (req.body["color_identity[]"]) {
        cardToChange.color_identity = req.body["color_identity[]"]
    } else {
        cardToChange.color_identity = []
    }
    await req.cube.save()
})

// change the cmc of a card in the cube
router.post('/cubes/edit-cube/change-cmc', creatorAccess, async (req, res) => {
    
    var component
    var component_id = req.body.cube_component

    if (component_id === "main_board") {
        component = req.cube.main_board
    } else if (req.cube.modules.id(component_id)){
        component = req.cube.modules.id(component_id).cards
    } else {
        component = req.cube.rotations.id(component_id).cards
    }

    var cardToChange = component.id(req.body.card_id)
    cardToChange.cmc = req.body.changed_cmc
    await req.cube.save()
})

// change the printing of a card in the cube
router.post('/cubes/edit-cube/change-set', creatorAccess, async (req, res) => {
    
    var component
    var component_id = req.body.cube_component

    if (component_id === "main_board") {
        component = req.cube.main_board
    } else if (req.cube.modules.id(component_id)){
        component = req.cube.modules.id(component_id).cards
    } else {
        component = req.cube.rotations.id(component_id).cards
    }
    
    var cardToChange = component.id(req.body.card_id)
    cardToChange.image = req.body.changed_image
    if (req.body.changed_back_image) {
        cardToChange.back_image = req.body.changed_back_image
    }
    cardToChange.purchase_link = req.body.changed_purchase_link
    cardToChange.set = req.body.changed_printing
    await req.cube.save()
    res.redirect('/cubes/edit-cube?cube_id=' + req.cube._id + '&cube_component=' + component_id + '&limit=50&skip=0')
})

// move a card from one component of the cube to another or delete it from the cube entirely
router.post('/cubes/edit-cube/change-component', creatorAccess, async (req, res) => {

    var current_component
    var current_component_id = req.body.current_cube_component
    var new_component
    var new_component_id = req.body.new_cube_component

    if (current_component_id === "main_board") {
        current_component = req.cube.main_board
    } else if (req.cube.modules.id(current_component_id)) {
        current_component = req.cube.modules.id(current_component_id).cards
    } else {
        current_component = req.cube.rotations.id(current_component_id).cards
    }

    var cardToMove = current_component.id(req.body.card_id)
    current_component.pull(cardToMove)

    if (new_component_id != "delete_from_cube") {
        if (new_component_id === "main_board") {
            new_component = req.cube.main_board
        } else if (req.cube.modules.id(new_component_id)){
            new_component = req.cube.modules.id(new_component_id).cards
        } else {
            new_component = req.cube.rotations.id(new_component_id).cards
        }
        new_component.push(cardToMove)
    }

    await req.cube.save()
    res.redirect('/cubes/edit-cube?cube_id=' + req.cube._id + '&cube_component=' + current_component_id + '&limit=50&skip=0')
})

module.exports = router