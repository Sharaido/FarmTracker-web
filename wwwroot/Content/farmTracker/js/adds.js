$(document).ready(() => {
    if ($('#postAddForm').length > 0) {
        printSubCategories("30")

        $("#postAddForm").validate({
            onsubmit: false,
            errorClass: "clr-danger",
            rules: {
                Name: {
                    required: true,
                    minlength: 3,
                    maxlength: 50
                },
                Description: {
                    maxlength: 2000
                },
                Price: {
                    required: true,
                }

            }
        });
    }
    if ($("#categoryProperties").length > 0 && $("#hiddenCUID").length > 0 && $("#hiddenCUID").val()) {
        getCategoryProperties($("#hiddenCUID").val())
    }
})

$('#postAddForm').submit(() => {
    if (!$("#CUID").val() || $("#CUID").val() == 0) {
        $("#postAddFormWarn").html(`<div class="alert alert-danger" role="alert">Complete selecting category</div>`)
        return false;
    }
    if (!$("#postAddForm").valid()) {
        return false;
    }
    showLoading($("#postAddForm"))
    return true
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