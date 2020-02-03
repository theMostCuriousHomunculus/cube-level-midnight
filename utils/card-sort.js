function colorSort(cards) {
    
    // var colorArrays = {
    //     colorless_cards: [], white_cards: [], blue_cards: [], black_cards: [], red_cards: [], green_cards: [], azorius_cards: [], boros_cards: [], dimir_cards: [], izzet_cards: [], golgari_cards: [], gruul_cards: [], orzhov_cards: [], rakdos_cards: [], selesnya_cards: [], simic_cards: [], abzan_cards: [], bant_cards: [], esper_cards: [], grixis_cards: [], jeskai_cards: [], jund_cards: [], mardu_cards: [], naya_cards: [], sultai_cards: [], temur_cards: [], WUBR_cards: [], WUBG_cards: [], WURG_cards: [], WBRG_cards: [], UBRG_cards: [], WUBRG_cards: []
    // }

    var monocolor = {
        White: {cards: []}, Blue: {cards: []}, Black: {cards: []}, Red: {cards: []}, Green: {cards: []}
    }

    var multicolor = {
        Azorius: {cards: []}, Boros: {cards: []}, Dimir: {cards: []}, Izzet: {cards: []}, Golgari: {cards: []}, Gruul: {cards: []}, Orzhov: {cards: []}, Rakdos: {cards: []}, Selesnya: {cards: []}, Simic: {cards: []}, Abzan: {cards: []}, Bant: {cards: []}, Esper: {cards: []}, Grixis: {cards: []}, Jeskai: {cards: []}, Jund: {cards: []}, Mardu: {cards: []}, Naya: {cards: []}, Sultai: {cards: []}, Temur: {cards: []}, WUBR: {cards: []}, WUBG: {cards: []}, WURG: {cards: []}, WBRG: {cards: []}, UBRG: {cards: []}, WUBRG: {cards: []}
    }

    var colorless = {cards: []}

    cards.forEach(function (card) {
    
        var ci = card.color_identity

        if (ci.length === 0) {
            colorless.cards.push(card)
        } else if (ci.length === 1) {
            if (ci.includes("W")) {
                monocolor.White.cards.push(card)
            } else if (ci.includes("U")) {
                monocolor.Blue.cards.push(card)
            } else if (ci.includes("B")) {
                monocolor.Black.cards.push(card)
            } else if (ci.includes("R")) {
                monocolor.Red.cards.push(card)
            } else {
                monocolor.Green.cards.push(card)
            }
        } else if (ci.length === 2) {
            if (ci.includes("W") && ci.includes("U")) {
                multicolor.Azorius.cards.push(card)
            } else if (ci.includes("W") && ci.includes("R")) {
                multicolor.Boros.cards.push(card)
            } else if (ci.includes("U") && ci.includes("B")) {
                multicolor.Dimir.cards.push(card)
            } else if (ci.includes("U") && ci.includes("R")) {
                multicolor.Izzet.cards.push(card)
            } else if (ci.includes("B") && ci.includes("G")) {
                multicolor.Golgari.cards.push(card)
            } else if (ci.includes("R") && ci.includes("G")) {
                multicolor.Gruul.cards.push(card)
            } else if (ci.includes("W") && ci.includes("B")) {
                multicolor.Orzhov.cards.push(card)
            } else if (ci.includes("R") && ci.includes("B")) {
                multicolor.Rakdos.cards.push(card)
            } else if (ci.includes("W") && ci.includes("G")) {
                multicolor.Selesnya.cards.push(card)
            } else {
                multicolor.Simic.cards.push(card)
            }
        } else if (ci.length === 3) {
            if (ci.includes("W") && ci.includes("B") && ci.includes("G")) {
                multicolor.Abzan.cards.push(card)
            } else if (ci.includes("W") && ci.includes("U") && ci.includes("G")) {
                multicolor.Bant.cards.push(card)
            } else if (ci.includes("W") && ci.includes("U") && ci.includes("B")) {
                multicolor.Esper.cards.push(card)
            } else if (ci.includes("U") && ci.includes("B") && ci.includes("R")) {
                multicolor.Grixis.cards.push(card)
            } else if (ci.includes("W") && ci.includes("U") && ci.includes("R")) {
                multicolor.Jeskai.cards.push(card)
            } else if (ci.includes("B") && ci.includes("R") && ci.includes("G")) {
                multicolor.Jund.cards.push(card)
            } else if (ci.includes("W") && ci.includes("B") && ci.includes("R")) {
                multicolor.Mardu.cards.push(card)
            } else if (ci.includes("W") && ci.includes("R") && ci.includes("G")) {
                multicolor.Naya.cards.push(card)
            } else if (ci.includes("U") && ci.includes("B") && ci.includes("G")) {
                multicolor.Sultai.cards.push(card)
            } else {
                multicolor.Temur.cards.push(card)
            }
        } else if (ci.length === 4) {
            if (ci.includes("W") && ci.includes("U") && ci.includes("B") && ci.includes("R")) {
                multicolor.WUBR.cards.push(card)
            } else if (ci.includes("W") && ci.includes("U") && ci.includes("B") && ci.includes("G")) {
                multicolor.WUBG.cards.push(card)
            } else if (ci.includes("W") && ci.includes("U") && ci.includes("R") && ci.includes("G")) {
                multicolor.WURG.cards.push(card)
            } else if (ci.includes("W") && ci.includes("B") && ci.includes("R") && ci.includes("G")) {
                multicolor.WBRG.cards.push(card)
            } else {
                multicolor.UBRG.cards.push(card)
            }
        } else {
            multicolor.WUBRG.cards.push(card)
        }
    })


    for (var color in monocolor) {
        monocolor[color].cards.sort(function (a, b) {
            return a["cmc"] - b["cmc"] || a["name"].localeCompare(b["name"])
        })
        monocolor[color].artifacts = monocolor[color].cards.filter(function(card) {
            return card.type_line.includes("Artifact") && !card.type_line.includes("Creature")
        })
        monocolor[color].creatures = monocolor[color].cards.filter(function(card) {
            return card.type_line.includes("Creature")
        })
        monocolor[color].enchantments = monocolor[color].cards.filter(function(card) {
            return card.type_line.includes("Enchantment") && !card.type_line.includes("Creature")
        })
        monocolor[color].instants = monocolor[color].cards.filter(function(card) {
            return card.type_line.includes("Instant")
        })
        monocolor[color].lands = monocolor[color].cards.filter(function(card) {
            return card.type_line.includes("Land") && !card.type_line.includes("Creature")
        })
        monocolor[color].sorceries = monocolor[color].cards.filter(function(card) {
            return card.type_line.includes("Sorcery")
        })
    }

    for (var color in multicolor) {
        multicolor[color].cards.sort(function (a, b) {
            return a["cmc"] - b["cmc"] || a["name"].localeCompare(b["name"])
        })
    }

    colorless.cards.sort(function (a, b) {
        return a["cmc"] - b["cmc"] || a["name"].localeCompare(b["name"])
    })
    colorless.artifacts = colorless.cards.filter(function(card) {
        return card.type_line.includes("Artifact") && !card.type_line.includes("Creature")
    })
    colorless.creatures = colorless.cards.filter(function(card) {
        return card.type_line.includes("Creature")
    })
    colorless.enchantments = colorless.cards.filter(function(card) {
        return card.type_line.includes("Enchantment") && !card.type_line.includes("Creature")
    })
    colorless.instants = colorless.cards.filter(function(card) {
        return card.type_line.includes("Instant")
    })
    colorless.lands = colorless.cards.filter(function(card) {
        return card.type_line.includes("Land") && !card.type_line.includes("Creature")
    })
    colorless.sorceries = colorless.cards.filter(function(card) {
        return card.type_line.includes("Sorcery")
    })

    return { monocolor, multicolor, colorless }
}

function alphabeticalSort(cards) {
    cards.sort(function (a, b) {
        return a["name"].localeCompare(b["name"])
    })
    return cards
}

module.exports = {
    colorSort,
    alphabeticalSort
}