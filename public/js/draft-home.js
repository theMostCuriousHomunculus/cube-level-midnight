function getCubeComponents() {
    const cubeToDraft = document.getElementById("cube_to_draft")
    const moduleCheckboxes = document.getElementById("module_checkboxes")

    jQuery.ajax({
        type: "GET",
        url: '/cubes/find-cube-components',
        xhrFields: { withCredentials: true },
        data: {
            cube_id: cubeToDraft.value
        },
        success: function(response) {
            while (moduleCheckboxes.firstChild) {
                moduleCheckboxes.removeChild(moduleCheckboxes.firstChild)
            }
            response.forEach(function(x) {
                var input = document.createElement("input")
                input.type = "checkbox"
                input.id = x._id
                input.name = "modules[]"
                input.value = x._id
                
                var inputLabel = document.createElement("label")
                inputLabel.htmlFor = x._id
                inputLabel.appendChild(document.createTextNode(x.module_name))
                
                moduleCheckboxes.appendChild(input)
                moduleCheckboxes.appendChild(inputLabel)
                moduleCheckboxes.appendChild(document.createElement("br"))
            })
        }
    })
}