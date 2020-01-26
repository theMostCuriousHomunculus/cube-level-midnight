const addCard = document.getElementById("add_card")
const backImage = document.getElementById("back_image")
const cardResults = document.getElementById("card_results")
const cardToAdd = document.getElementById("card_to_add")
const cmc = document.getElementById("cmc")
const image = document.getElementById("image")
const loyalty = document.getElementById("loyalty")
const manaCost = document.getElementById("mana_cost")
const oracleId = document.getElementById("oracle_id")
const power = document.getElementById("power")
const purchaseLink = document.getElementById("purchase_link")
const selectedPrinting = document.getElementById("selected_printing")
const toughness = document.getElementById("toughness")
const typeLine = document.getElementById("type_line")
var request = null

function scryfallCardSearch() {
    
    if (request) {
        request.abort()
    }

    cardResults.innerHTML = ""
    selectedPrinting.innerHTML = '<option disabled hidden selected value>...</option>'

    if (cardToAdd.value.length > 2) {
        request = jQuery.ajax({
            type: 'GET',
            url: 'https://api.scryfall.com/cards/search?q=' + cardToAdd.value.replace(" ", "_"),
            dataType: 'json',
            success: function(cardSuggestions) {

                cardSuggestions.data.forEach(function(suggestion) {
                    
                    var option = document.createElement("option")
                    option.setAttribute("value", suggestion.name)
                    option.setAttribute("data-cmc", suggestion.cmc)
                    if (suggestion.color_identity.length > 0) {
                        option.setAttribute("data-color_identity", suggestion.color_identity)
                    }
                    if (suggestion.loyalty) {
                        option.setAttribute("data-loyalty", suggestion.loyalty)
                    }
                    if (suggestion.layout === "transform") {
                        if (suggestion.card_faces[0].mana_cost != "") {
                            option.setAttribute("data-mana_cost", suggestion.card_faces[0].mana_cost)
                        } else {
                            option.setAttribute("data-mana_cost", "{0}")
                        }
                        if (suggestion.card_faces[0].power) {
                            option.setAttribute("data-power", suggestion.card_faces[0].power)
                        }
                        if (suggestion.card_faces[0].toughness) {
                            option.setAttribute("data-toughness", suggestion.card_faces[0].toughness)
                        }
                        option.setAttribute("data-type_line", suggestion.card_faces[0].type_line)
                    } else {
                        if (suggestion.mana_cost != "") {
                            option.setAttribute("data-mana_cost", suggestion.mana_cost)
                        } else {
                            option.setAttribute("data-mana_cost", "{0}")
                        }
                        if (suggestion.power) {
                            option.setAttribute("data-power", suggestion.power)
                        }
                        if (suggestion.toughness) {
                            option.setAttribute("data-toughness", suggestion.toughness)
                        }
                        option.setAttribute("data-type_line", suggestion.type_line)
                    }
                    
                    option.setAttribute("data-oracle_id", suggestion.oracle_id)
                    option.setAttribute("data-prints_search_uri", suggestion.prints_search_uri)
                    cardResults.appendChild(option)                    
                })
            },
            error: function(e) {
                cardResults.innerHTML = '<option disabled selected value="No matches..."/>'
            }
        })
    }
}

function scryfallPrintSearch() {
    
    selectedPrinting.innerHTML = ""
    var colorIdentity = document.getElementsByName("color_identity[]")

    for (var index = colorIdentity.length - 1; index >= 0; index--) {
        colorIdentity[index].parentNode.removeChild(colorIdentity[index])
    }

    var options = []
    cardResults.childNodes.forEach(function(child) {
        options.push(child.value)
    })
    var chosenOptionIndex = options.indexOf(cardToAdd.value)

    if (chosenOptionIndex != -1) {
        var chosenOption = cardResults.children[chosenOptionIndex]

        cmc.setAttribute("value", chosenOption.getAttribute("data-cmc"))
        if (chosenOption.getAttribute("data-color_identity")) {
            chosenOption.getAttribute("data-color_identity").split(",").forEach(function(color) {
                var input = document.createElement("input")
                input.setAttribute("type", "hidden")
                input.setAttribute("name", "color_identity[]")
                input.setAttribute("value", color)
                addCard.appendChild(input)
            })
        }
        if (chosenOption.getAttribute("data-loyalty")) {
            loyalty.setAttribute("value", chosenOption.getAttribute("data-loyalty"))
        }
        manaCost.setAttribute("value", chosenOption.getAttribute("data-mana_cost"))
        oracleId.setAttribute("value", chosenOption.getAttribute("data-oracle_id"))
        if (chosenOption.getAttribute("data-power")) {
            power.setAttribute("value", chosenOption.getAttribute("data-power"))
        }
        if (chosenOption.getAttribute("toughness")) {
            toughness.setAttribute("value", chosenOption.getAttribute("data-toughness"))
        }
        typeLine.setAttribute("value", chosenOption.getAttribute("data-type_line"))


        jQuery.ajax({
            type: 'GET',
            url: chosenOption.getAttribute("data-prints_search_uri"),
            dataType: 'json',
            success: function(cardPrintings) {
                
                cardPrintings.data.forEach(function(printing) {
                    var option = document.createElement("option")
                    option.setAttribute("value", printing.set)
                    option.setAttribute("data-id", printing.id)
                    if (printing.layout === "transform") {
                        option.setAttribute("data-image", printing.card_faces[0].image_uris.large)
                        option.setAttribute("data-back_image", printing.card_faces[1].image_uris.large)
                    } else {
                        option.setAttribute("data-image", printing.image_uris.large)
                    }
                    option.setAttribute("data-purchase_link", printing.purchase_uris.tcgplayer.split("&")[0])
                    option.innerHTML = printing.set
                    selectedPrinting.appendChild(option)
                })
            },
            error: function(e) {
                selectedPrinting.innerHTML = '<option disabled hidden selected value>...</option>'
            }
        })
    }
}

function submitAddCard() {
    event.preventDefault()

    var options = []
    selectedPrinting.childNodes.forEach(function(child) {
        options.push(child.getAttribute("data-id"))
    })
    var chosenOptionIndex = options.indexOf(selectedPrinting.childNodes[selectedPrinting.selectedIndex].getAttribute("data-id"))

    if (chosenOptionIndex != -1) {
        var chosenOption = selectedPrinting.childNodes[chosenOptionIndex]

        image.setAttribute("value", chosenOption.getAttribute("data-image"))
        if (chosenOption.hasAttribute("data-back_image")) {
            backImage.setAttribute("value", chosenOption.getAttribute("data-back_image"))
        }
        purchaseLink.setAttribute("value", chosenOption.getAttribute("data-purchase_link"))
    
        addCard.removeAttribute("onsubmit")
        addCard.submit()
    } else {
        alert("We couldn't find that card.  Please try again!")
    }
}

async function enablePrintChange() {

    var eventTarget
    if (event.target.tagName === "BUTTON") {
        eventTarget = event.target
    } else {
        eventTarget = event.target.parentNode
    }

    var oracleId = eventTarget.nextElementSibling.getAttribute('data-oracleID')
    var currentSet = eventTarget.nextElementSibling.getAttribute('data-currentSet')

    jQuery.ajax({
        type: 'GET',
        url: "https://api.scryfall.com/cards/search?q=oracleid%3A" + oracleId + "&unique=prints",
        dataType: 'json',
        success: function(cardPrintings) {

            cardPrintings.data.forEach(function(printing) {
                
                if (printing.set != currentSet) {
                    var option = document.createElement("option")
                    option.setAttribute("value", printing.set)
                    if (printing.layout === "transform") {
                        option.setAttribute("data-image", printing.card_faces[0].image_uris.large)
                        option.setAttribute("data-back_image", printing.card_faces[1].image_uris.large)
                    } else {
                        option.setAttribute("data-image", printing.image_uris.large)
                    }
                    option.setAttribute("data-purchase_link", printing.purchase_uris.tcgplayer.split("&")[0])
                    option.innerHTML = printing.set
                    eventTarget.nextElementSibling.appendChild(option)
                }
            })
            eventTarget.removeAttribute("onclick")
            eventTarget.setAttribute("onclick", "disablePrintChange()")
            eventTarget.innerHTML = '<i class="fas fa-lock-open"></i>'
            eventTarget.nextElementSibling.removeAttribute("disabled")
        },
        error: function(e) {
            eventTarget.nextElementSibling.innerHTML = '<option disabled hidden selected value>...</option>'
        }
    })
}

function disablePrintChange() {

    var eventTarget
    if (event.target.tagName === "BUTTON") {
        eventTarget = event.target
    } else {
        eventTarget = event.target.parentNode
    }

    eventTarget.removeAttribute("onclick")
    eventTarget.setAttribute("onclick", "enablePrintChange()")
    eventTarget.innerHTML = '<i class="fas fa-lock"></i>'
    eventTarget.nextElementSibling.setAttribute("disabled", true)
}

function submitPrintChange() {
    var form = event.target.parentNode
    form.children[3].value = event.target.children[event.target.selectedIndex].getAttribute("data-image")
    if (event.target.children[event.target.selectedIndex].hasAttribute("data-back_image")) {
        form.children[4].value = event.target.children[event.target.selectedIndex].getAttribute("data-back_image")
    }
    form.children[5].value = event.target.children[event.target.selectedIndex].getAttribute("data-purchase_link")
    form.submit()
}