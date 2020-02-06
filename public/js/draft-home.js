const cubeToDraft = document.getElementById("cube_to_draft")
const moduleCheckboxesAndLabels = document.getElementById("module_checkboxes")
const cardCount = document.getElementById("card_count")

function getCubeComponents() {

    jQuery.ajax({
        type: "GET",
        url: '/cubes/find-cube-components',
        xhrFields: { withCredentials: true },
        data: {
            cube_id: cubeToDraft.value
        },
        success: function(response) {
            while (moduleCheckboxesAndLabels.firstChild) {
                moduleCheckboxesAndLabels.removeChild(moduleCheckboxesAndLabels.firstChild)
            }
            response.modules.forEach(function(x) {
                var input = document.createElement("input")
                input.type = "checkbox"
                input.id = x._id
                input.name = "modules[]"
                input.setAttribute("class", "module_checkbox")
                input.value = x._id
                input.setAttribute("data-size", x.cards.length)
                input.setAttribute("onclick", "changeCardPoolSize()")
                
                var inputLabel = document.createElement("label")
                inputLabel.htmlFor = x._id
                inputLabel.appendChild(document.createTextNode(x.module_name))
                
                moduleCheckboxesAndLabels.appendChild(input)
                moduleCheckboxesAndLabels.appendChild(inputLabel)
                moduleCheckboxesAndLabels.appendChild(document.createElement("br"))
            })
            cardCount.setAttribute("data-main_board_and_rotation_cards_only", response.card_count)
            cardCount.innerText = response.card_count
        }
    })
}

function changeCardPoolSize() {
    let count = Number(cardCount.getAttribute("data-main_board_and_rotation_cards_only"))
    const moduleCheckboxes = document.getElementsByClassName("module_checkbox")

    for (var index = 0; index < moduleCheckboxes.length; index++) {
        if (moduleCheckboxes.item(index).checked === true) {
            count = count + Number(moduleCheckboxes.item(index).getAttribute("data-size"))
        }
    }
    cardCount.innerText = count
}