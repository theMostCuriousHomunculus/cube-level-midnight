const cardImageContainer = document.getElementById("card_image_container")
const cardImage = document.getElementById("card_image")
const cardBackImage = document.getElementById("card_back_image")

function displayImage() {
    cardImageContainer.style.display = "block"
    cardImage.src = event.target.firstElementChild.src
    cardImage.style.display = "inline"
    if (event.target.childElementCount >= 2) {
        cardBackImage.src = event.target.firstElementChild.nextElementSibling.src
        cardBackImage.style.display = "inline"
    }
    event.target.style.backgroundColor = "rgb(255,255,0)"
}

function clearImage() {
    cardImageContainer.style.display = "none"
    cardImage.src = ""
    cardImage.style.display = "none"
    if (event.target.childElementCount >= 2) {
        cardBackImage.src = ""
        cardBackImage.style.display = "none"
    }
    event.target.style.backgroundColor = "unset"
}

function repositionCardImageContainer(event) {
    cardImageContainer.style.top = event.pageY + 12 + "px"
    cardImageContainer.style.left = event.pageX + 10 + "px"
}

document.addEventListener("mousemove", repositionCardImageContainer)