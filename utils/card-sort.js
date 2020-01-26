function colorSort(cards) {
    
    var colorArrays = {
        colorless_cards: [], white_cards: [], blue_cards: [], black_cards: [], red_cards: [], green_cards: [], azorius_cards: [], boros_cards: [], dimir_cards: [], izzet_cards: [], golgari_cards: [], gruul_cards: [], orzhov_cards: [], rakdos_cards: [], selesnya_cards: [], simic_cards: [], abzan_cards: [], bant_cards: [], esper_cards: [], grixis_cards: [], jeskai_cards: [], jund_cards: [], mardu_cards: [], naya_cards: [], sultai_cards: [], temur_cards: [], WUBR_cards: [], WUBG_cards: [], WURG_cards: [], WBRG_cards: [], UBRG_cards: [], WUBRG_cards: []
    }

    cards.forEach(function (card) {
    
        var ci = card.color_identity

        if (ci.length === 0) {
            colorArrays.colorless_cards.push(card)
        } else if (ci.length === 1) {
            if (ci.includes("W")) {
                colorArrays.white_cards.push(card)
            } else if (ci.includes("U")) {
                colorArrays.blue_cards.push(card)
            } else if (ci.includes("B")) {
                colorArrays.black_cards.push(card)
            } else if (ci.includes("R")) {
                colorArrays.red_cards.push(card)
            } else {
                colorArrays.green_cards.push(card)
            }
        } else if (ci.length === 2) {
            if (ci.includes("W") && ci.includes("U")) {
                colorArrays.azorius_cards.push(card)
            } else if (ci.includes("W") && ci.includes("R")) {
                colorArrays.boros_cards.push(card)
            } else if (ci.includes("U") && ci.includes("B")) {
                colorArrays.dimir_cards.push(card)
            } else if (ci.includes("U") && ci.includes("R")) {
                colorArrays.izzet_cards.push(card)
            } else if (ci.includes("B") && ci.includes("G")) {
                colorArrays.golgari_cards.push(card)
            } else if (ci.includes("R") && ci.includes("G")) {
                colorArrays.gruul_cards.push(card)
            } else if (ci.includes("W") && ci.includes("B")) {
                colorArrays.orzhov_cards.push(card)
            } else if (ci.includes("R") && ci.includes("B")) {
                colorArrays.rakdos_cards.push(card)
            } else if (ci.includes("W") && ci.includes("G")) {
                colorArrays.selesnya_cards.push(card)
            } else {
                colorArrays.simic_cards.push(card)
            }
        } else if (ci.length === 3) {
            if (ci.includes("W") && ci.includes("B") && ci.includes("G")) {
                colorArrays.abzan_cards.push(card)
            } else if (ci.includes("W") && ci.includes("U") && ci.includes("G")) {
                colorArrays.bant_cards.push(card)
            } else if (ci.includes("W") && ci.includes("U") && ci.includes("B")) {
                colorArrays.esper_cards.push(card)
            } else if (ci.includes("U") && ci.includes("B") && ci.includes("R")) {
                colorArrays.grixis_cards.push(card)
            } else if (ci.includes("W") && ci.includes("U") && ci.includes("R")) {
                colorArrays.jeskai_cards.push(card)
            } else if (ci.includes("B") && ci.includes("R") && ci.includes("G")) {
                colorArrays.jund_cards.push(card)
            } else if (ci.includes("W") && ci.includes("B") && ci.includes("R")) {
                colorArrays.mardu_cards.push(card)
            } else if (ci.includes("W") && ci.includes("R") && ci.includes("G")) {
                colorArrays.naya_cards.push(card)
            } else if (ci.includes("U") && ci.includes("B") && ci.includes("G")) {
                colorArrays.sultai_cards.push(card)
            } else {
                colorArrays.temur_cards.push(card)
            }
        } else if (ci.length === 4) {
            if (ci.includes("W") && ci.includes("U") && ci.includes("B") && ci.includes("R")) {
                colorArrays.WUBR_cards.push(card)
            } else if (ci.includes("W") && ci.includes("U") && ci.includes("B") && ci.includes("G")) {
                colorArrays.WUBG_cards.push(card)
            } else if (ci.includes("W") && ci.includes("U") && ci.includes("R") && ci.includes("G")) {
                colorArrays.WURG_cards.push(card)
            } else if (ci.includes("W") && ci.includes("B") && ci.includes("R") && ci.includes("G")) {
                colorArrays.WBRG_cards.push(card)
            } else {
                colorArrays.UBRG_cards.push(card)
            }
        } else {
            colorArrays.WUBRG_cards.push(card)
        }
    })


    for (const color in colorArrays) {
        colorArrays[color].sort(function (a, b) {
            return a["cmc"] - b["cmc"] || a["name"].localeCompare(b["name"])
        })
    }

    return colorArrays
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