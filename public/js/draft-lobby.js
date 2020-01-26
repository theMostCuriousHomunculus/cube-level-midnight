function draftCard() {
    const { lobby_name, user_id } = Qs.parse(location.search, { ignoreQueryPrefix: true })
    const card_id = event.target.value || event.target.parentNode.value

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
