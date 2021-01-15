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