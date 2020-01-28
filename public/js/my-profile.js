const changeAvatar = document.getElementById("change_avatar")
// const backImage = document.getElementById("back_image")
const cardResults = document.getElementById("card_results")
const cardToSearch = document.getElementById("card_to_search")
// const cmc = document.getElementById("cmc")
const image = document.getElementById("image")
// const loyalty = document.getElementById("loyalty")
// const manaCost = document.getElementById("mana_cost")
// const oracleId = document.getElementById("oracle_id")
// const power = document.getElementById("power")
// const purchaseLink = document.getElementById("purchase_link")
const selectedPrinting = document.getElementById("selected_printing")
// const toughness = document.getElementById("toughness")
// const typeLine = document.getElementById("type_line")
var request = null

function scryfallCardSearch() {
    
    if (request) {
        request.abort()
    }

    cardResults.innerHTML = ""
    selectedPrinting.innerHTML = '<option disabled hidden selected value>...</option>'

    if (cardToSearch.value.length > 2) {
        request = jQuery.ajax({
            type: 'GET',
            url: 'https://api.scryfall.com/cards/search?q=' + cardToSearch.value.replace(" ", "_"),
            dataType: 'json',
            success: function(cardSuggestions) {

                cardSuggestions.data.forEach(function(suggestion) {
                    
                    var option = document.createElement("option")
                    option.setAttribute("value", suggestion.name)
                    // option.setAttribute("data-oracle_id", suggestion.oracle_id)
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

    var options = []
    cardResults.childNodes.forEach(function(child) {
        options.push(child.value)
    })
    var chosenOptionIndex = options.indexOf(cardToSearch.value)

    if (chosenOptionIndex != -1) {
        var chosenOption = cardResults.children[chosenOptionIndex]

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
                        option.setAttribute("data-image", printing.card_faces[0].image_uris.art_crop)
                        // option.setAttribute("data-back_image", printing.card_faces[1].image_uris.art_crop)
                    } else {
                        option.setAttribute("data-image", printing.image_uris.art_crop)
                    }
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

function submitChangeAvatar() {
    event.preventDefault()

    var options = []
    selectedPrinting.childNodes.forEach(function(child) {
        options.push(child.getAttribute("data-id"))
    })
    var chosenOptionIndex = options.indexOf(selectedPrinting.childNodes[selectedPrinting.selectedIndex].getAttribute("data-id"))

    if (chosenOptionIndex != -1) {
        var chosenOption = selectedPrinting.childNodes[chosenOptionIndex]

        image.setAttribute("value", chosenOption.getAttribute("data-image"))
        // if (chosenOption.hasAttribute("data-back_image")) {
        //     backImage.setAttribute("value", chosenOption.getAttribute("data-back_image"))
        // }
    
        changeAvatar.removeAttribute("onsubmit")
        changeAvatar.submit()
    } else {
        alert("We couldn't find that card.  Please try again!")
    }
}