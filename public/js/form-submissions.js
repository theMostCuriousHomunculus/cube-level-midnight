function genericSubmit() {
    event.target.parentNode.submit()
}

function changeViewedComponent() {
    
    var { cube_id } = Qs.parse(location.search, { ignoreQueryPrefix: true })
    
    window.location = '/cubes/edit-cube?cube_id=' + cube_id + '&cube_component=' + event.target.value + '&limit=50&skip=0'
}

function changeCardsPerPage() {
    
    var { cube_id, cube_component} = Qs.parse(location.search, { ignoreQueryPrefix: true })
    limit = event.target.value
    
    window.location = '/cubes/edit-cube?cube_id=' + cube_id + '&cube_component=' + cube_component + '&limit=' + limit + '&skip=0'
}

function pageBack() {

    var { cube_id, cube_component, limit, skip } = Qs.parse(location.search, { ignoreQueryPrefix: true })
    limit = parseInt(limit)
    skip = parseInt(skip)

    if (skip !== 0) {
        window.location = '/cubes/edit-cube?cube_id=' + cube_id + '&cube_component=' + cube_component + '&limit=' + limit + '&skip=' + (skip - 1)
    }
}

function pageForward(max_pages) {
    
    var { cube_id, cube_component, limit, skip } = Qs.parse(location.search, { ignoreQueryPrefix: true })
    limit = parseInt(limit)
    skip = parseInt(skip)

    if (skip !== max_pages - 1) {
        window.location = '/cubes/edit-cube?cube_id=' + cube_id + '&cube_component=' + cube_component + '&limit=' + limit + '&skip=' + (skip + 1)
    }
}

function submitAddModule() {    
    event.preventDefault()
    var form = document.getElementById("add_module_form")
    jQuery.ajax({
        type: "POST",
        url: '/cubes/edit-cube/check-module-name',
        xhrFields: { withCredentials: true },
        data: {
            cube_id: form.children[0].value,
            module_to_add: form.children[2].value
        },
        success: function() {
            form.removeAttribute('onsubmit')
            form.submit()
        },
        error: function() {
            alert("You already have a module with that name!")
        }
    })
}

function submitAddRotation() {
    event.preventDefault()
    var form = document.getElementById("add_rotation_form")
    jQuery.ajax({
        type: "POST",
        url: '/cubes/edit-cube/check-rotation-name',
        xhrFields: { withCredentials: true },
        data: {
            cube_id: form.children[0].value,
            rotation_to_add: form.children[2].value
        },
        success: function() {
            form.removeAttribute('onsubmit')
            form.submit()
        },
        error: function() {
            alert("You already have a rotation with that name!")
        }
    })
}

function submitChangeRotationSize() {
    jQuery.ajax({
        type: "POST",
        url: '/cubes/edit-cube/change-rotation-size',
        xhrFields: { withCredentials: true },
        data: {
            rotation_size: event.target.value,
            cube_id: event.target.parentNode.children[0].value,
            cube_component: event.target.parentNode.children[1].value
        }
    })
}

function submitCmcChange() {
    jQuery.ajax({
        type: "POST",
        url: '/cubes/edit-cube/change-cmc',
        xhrFields: { withCredentials: true },
        data: {
            changed_cmc: event.target.value,
            cube_id: event.target.parentNode.children[0].value,
            card_id: event.target.parentNode.children[1].value,
            cube_component: event.target.parentNode.children[2].value
        }
    })
}

function submitColorIdentityChange() {

    // this code figures out what the new color identity array is based on which boxes are checked
    var colorIdentity = []
    var node = event.target.parentNode.firstChild

    while (node) {
        if (node.nodeType === Node.ELEMENT_NODE && node.checked) {
            colorIdentity.push(node.getAttribute('name'))
        }
        node = node.nextElementSibling || node.nextSibling
    }

    jQuery.ajax({
        type: "POST",
        url: '/cube/edit-cube/change-color-identity',
        xhrFields: { withCredentials: true },
        data: {
            color_identity: colorIdentity,
            cube_id: event.target.parentNode.children[0].value,
            card_id: event.target.parentNode.children[1].value,
            cube_component: event.target.parentNode.children[2].value
        }
    })
}

function submitComponentChange() {
    var form = document.getElementById("rename_component_form")
    var selectedIndex = document.getElementById("cube_component").selectedIndex
    var componentType = document.getElementById("cube_component").children[selectedIndex].getAttribute("data-component_type")
    var { limit, skip } = Qs.parse(location.search, { ignoreQueryPrefix: true })
    limit = parseInt(limit)
    skip = parseInt(skip)

    jQuery.ajax({
        type: "POST",
        url: '/cubes/edit-cube/rename-component',
        xhrFields: { withCredentials: true },
        data: {
            cube_id: form.children[0].value,
            cube_component: form.children[1].value,
            changed_component_name: form.children[3].value,
            component_type: componentType
        },
        dataType: 'text json',
        success: function(result) {
            window.location = '/cubes/edit-cube?cube_id=' + result.cube_id + '&cube_component=' + result.cube_component + '&limit=' + limit + '&skip=' + skip
        },
        error: function(e) {
            var responseJson = JSON.parse(e.responseText)
            form.children[3].value = responseJson.previous_component_name
            alert("You already have a component with that name!")
            form.children[3].focus()
        }
    })
}

function submitCubeInfoChange() {
    var form = document.getElementById("cube_info_form")
    jQuery.ajax({
        type: "POST",
        url: '/cubes/edit-cube/change-cube-info',
        xhrFields: { withCredentials: true },
        data: {
            cube_id: form.children[0].value,
            cube_name: form.children[2].value,
            cube_description: form.children[4].value
        },
        dataType: 'text json',
        error: function(e) {
            var responseJson = JSON.parse(e.responseText)
            form.children[2].value = responseJson.previous_cube_name
            alert("You already have a cube with that name!")
            form.children[2].focus()
        }
    })
}

function verifyDelete() {
    event.preventDefault()
    var sure = confirm("Are you sure you want to delete this component?  This action cannot be undone.")

    if (sure) {
        event.target.submit()
    }
}