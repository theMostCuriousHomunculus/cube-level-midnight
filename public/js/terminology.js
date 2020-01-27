const termDefinitionContainer = document.getElementById("term_definition_container")
const termDefinition = document.getElementById("term_definition")

function explainModules() {
    termDefinitionContainer.style.display = "block"
    termDefinition.innerText = "A module is a collection of cards that will either all be included in a draft or all be excluded from a draft.  If you want to support parasitic archetypes like tribal strategies, modules are a great option.  When you host a draft, you will be prompted to select which modules, if any, you wish to include."
    termDefinition.style.display = "inline"
}

function explainRotations() {
    termDefinitionContainer.style.display = "block"
    termDefinition.innerText = "A rotation is a collection of cards from which a few will be randomly included in each draft while the rest are excluded.  If you want to increase variety in your drafts, rotations are a great option.  We recommend that rotations include cards that are the same color(s) and have similar CMCs and functions."
    termDefinition.style.display = "inline"
}

function clearTerm() {
    termDefinitionContainer.style.display = "none"
    termDefinition.innerText = ""
    termDefinition.style.display = "none"
}

function repositionTermDefinitionContainer(event) {
    termDefinitionContainer.style.top = event.pageY + 12 + "px"
    termDefinitionContainer.style.left = event.pageX + 10 + "px"
}

document.addEventListener("mousemove", repositionTermDefinitionContainer)