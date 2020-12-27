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

})

/*$('#postAddFormBtn').click(() => {
    if (!$("#CUID").val() || $("#CUID").val() == 0) {
        $("#postAddFormWarn").html(`<div class="alert alert-danger" role="alert">Complete selecting category</div>`)
        return;
    }
    if (!$("#postAddForm").valid()) {
        return;
    }

    showLoading($("#postAddForm"))
    $.ajax({
        type: "POST",
        url: "/Adds",
        data: $('#postAddForm').serialize(),
        success: function (result) {
            if (result) {
                window.location.href = "http://" + location.hostname + ":" + location.port + "/Adds/" + result.fuid
            } else {
                alert("Add could not be inserted#1")
                removeLoading()
            }
        },
        error: function () {
            alert("Add could not be inserted#2")
            removeLoading()
        }
    })
})*/

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