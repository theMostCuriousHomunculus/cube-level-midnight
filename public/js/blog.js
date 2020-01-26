var timestamps = document.getElementsByClassName('timestamp')
var index

function convertTimestamps() {
    for (index = timestamps.length - 1; index >= 0; index--) {
        timestamps[index].innerHTML = moment(timestamps[index].innerHTML).tz(moment.tz.guess()).format("MMM Do YYYY h:mm a zz")
    }
}

window.onload = convertTimestamps