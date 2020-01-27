function draftCard() {
    var eventTarget

    if (event.target.hasAttribute("data-card_name")) {
        eventTarget = event.target
    } else {
        eventTarget = event.target.parentNode
    }

    var sure = confirm("Are you sure you want to draft " + eventTarget.getAttribute("data-card_name") +"?")

    if (sure) {
        const { lobby_name, user_id } = Qs.parse(location.search, { ignoreQueryPrefix: true })
        const card_id = eventTarget.value

        jQuery.ajax({
            type: 'POST',
            url: '/draft/draft-card',
            xhrFields: { withCredentials: true },
            data: {
                card_id: card_id,
                lobby_name: lobby_name,
                user_id: user_id
            },
            success: function(response) {
                window.location.href = '/draft/join-lobby?lobby_name=' + lobby_name + '&user_id=' + user_id
            }
        })
    }
}
