$(document).ready(() => {
    if ($("#categoryProperties").length > 0 && $("#hiddenCUID").length > 0 && $("#hiddenCUID").val()) {
        getCategoryProperties($("#hiddenCUID").val())
    }
})
function getAddCPValues(AUID) {
    $.ajax({
        type: "GET",
        url: "/Adds/AddCOPValues/" + AUID,
        success: function (values) {
            if (values) {
                printAddCPValues(values)
            }
        }
    })
}
function printAddCPValues(values) {
    for (value of values) {
        if (value.value == "on") {
            $('#CP_' + value.puid).html("Yes")
        } else {
            $('#CP_' + value.puid).html(value.value)
        }

    }
}
function getCategoryProperties(CUID) {
    $.ajax({
        type: "GET",
        url: "/Farms/CategoryProperties/" + CUID,
        success: function (cProperties) {
            if (cProperties) {
                printCategoryPropertiesInputs(cProperties)
                if ($("#hiddenAUID").length > 0) {
                    getAddCPValues($("#hiddenAUID").val())
                }
            } else {
                $('#categoryProperties').html("")
            }
        }
    })
}
function printCategoryPropertiesInputs(cProperties) {
    var body = ''
    for (var property of cProperties) {
        body += `<label><b>${property.name}: </b><span id="CP_${property.puid}"></span></label>`
    }
    $('#categoryProperties').html(body)
}