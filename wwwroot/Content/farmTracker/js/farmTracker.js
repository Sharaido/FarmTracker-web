$(document).ready(function () {
    if ($('#farmLinks').length > 0) {
        $.ajax({
            type: "GET",
            url: "/Farms/GetUserAllFarms",
            success: function (farms) {
                printFarmLinks(farms)
            },
            error: function () {
                alert("Farms could not be retrieved")
            }
        })
    }
})

function printFarmLinks(farms){
    body = `<a href="javascript:;"><i class="fa fa-tractor"></i><span>Farms</span></a>
                <ul>`
    if (farms) {
        for (var farm of farms)
            body += `<li><a href="/Farms/${farm.fuid}">${farm.name}</a></li>`
    }
    if ($('#FarmFlagHidden').length == 0) 
        body +=     `<li><a href="javascript:addFarmPopup();">Add Farm</li>`
    body +=   `</ul>`
    $('#farmLinks').html(body)
    addNestedLinks($('#dk-nav')[0])
}

function addFarmPopup() {
    var addFarmFormBody = `
    <div class="container">
        <form id="addFarmForm" method="POST">
            <div class="form-group">
                <label for="">Farm Name</label>
                <input type="text" id="Name" name="Name" class="form-control" minlength="3" maxlength="50" required>
            </div>
            <div class="form-group">
                <label for="">Description</label>
                <textarea id="Description" name="Description" class="form-control" rows="3"></textarea>
            </div>
        </form>
    </div>`
    addFarmFormPopup = dkPopup({
        title: 'Add Farm',
        type: 'confirm',
        confirmClick: function () {
            submitAddFarmForm()
        },
        content: addFarmFormBody
    })
    addFarmFormValidations()
}

function submitAddFarmForm() {
    if (!$("#addFarmForm").valid()) {
        return;
    }
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($("#addFarmForm"))
    $.ajax({
        type: "POST",
        url: "/Farms/AddFarm",
        data: $('#addFarmForm').serialize(),
        success: function (result) {
            if (result) {
                //addFarmFormPopup.closeDkPop();
                window.location.href = "http://" + location.hostname + ":" + location.port + "/Farms/" + result.fuid
            } else {
                alert("Farms could not be inserted#1")
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        },
        error: function () {
            alert("Farms could not be inserted#2")
            confirmBtn.removeAttr('disabled').removeClass('disabled')
            removeLoading()
        }
    })
}

function addFarmFormValidations() {
    $("#addFarmForm").validate({
        onsubmit: false,
        errorClass: "clr-danger",
        rules: {
            Name: {
                required: true,
                minlength: 3,
                maxlength: 50
            },
            Description: {
                maxlength: 255
            }

        },
        messages: {
            Name: {
                required: "Name is required",
                minlength: jQuery.validator.format("Please, at least {0} characters are necessary"),
                maxlength: jQuery.validator.format("Please, at most {0} characters are necessary")
            },
            Description: {
            }
        }
    });
}




function showLoading(e) {
    body = `<div class="cover-content" id="loadingScreen"><div class="out-of-middle"><div class="middle"><div style="text-align:center"><div class="lds-ripple"><div></div><div></div></div></div></div></div></div>`
    e.append(body)
}
function removeLoading() {
    $('#loadingScreen').remove()
}


/* Get Adds */
$(document).ready(function () {
    if ($('#addsContainer').length > 0) {
        $.ajax({
            type: "GET",
            url: "/Adds",
            success: function (adds) {
                printAdds(adds)
            }
        })
    }
})
function printAdds(adds) {
    var body = ''
    if (adds) {
        for (add of adds) {
            body += `
        <div class="adds-item">
            <a href="/Adds/${add.auid}">`
            if (add.pictures.length > 0) {
                body += `<img src="Content/farmtracker/img/${add.pictures[0].address}" alt="">`
            } else {
                body += `<img src="Content/farmtracker/img/null-content.png" alt="">`
            }
            body += `<h1>${add.name}</h1>
            </a>
        </div>`
        }
    } else {
        body = "<h2>There is no add!</h2>"
    }
    $('#addsContainer').html(body)
}
/* Get Adds END */

$(document).ready(()=>{
    $('.express-menu-btn').click((e)=>{
        var btn = $(e.target)
        var menuId = btn.attr("data-menu-id")
        $(`#${menuId}`).toggleClass("active")
    })
    $('.express-menu-item').click((e)=>{
        var item = $(e.target)
        item.parent().removeClass("active")
    })
})