$(document).ready(function () {
    if ($('#allProperties').length > 0) {
        var FUID = window.location.href.toString().split("/").pop()
        $.ajax({
            type: "GET",
            url: "/Farms/GetFarmPropertiesFromFUID/" + FUID,
            success: function (properties) {
                printProperties(properties)
            },
            error: function () {
                alert("Properties could not be received")
            }
        })
    }
})

function printProperties(properties) {
    allBody = ""
    plantBody = ""
    animalBody = ""

    if (properties) {
        for (var property of properties) {
            var propertyBody = `
                <div class="card">
                    <div class="card-body">
                        <a href="${window.location.href.toString() + "/" + property.puid}">${property.name}</a>
                    </div>
                </div>
                <br>`

            allBody += propertyBody
            if (property.cuid == 1)
                plantBody += propertyBody
            if (property.cuid == 2)
                animalBody += propertyBody
        }
    }
    if (!allBody) {
        allBody = "<h1>This farm have not any property!</h1>"
        $('#allProperties').addClass('null-content')
    } 
    if (!plantBody) {
        plantBody = "<h1>This farm have not any plant property!</h1>"
        $('#plantProperties').addClass('null-content')
    }
    if (!animalBody) {
        animalBody = "<h1>This farm have not any animal property!</h1>"
        $('#animalProperties').addClass('null-content')
    }

    $('#allProperties').html(allBody)
    $('#plantProperties').html(plantBody)
    $('#animalProperties').html(animalBody)
}

$(document).ready(function () {
    if ($('#entities').length > 0) {
        var PUID = window.location.href.toString().split("/").pop()
        $.ajax({
            type: "GET",
            url: "/Farms/GetFPEntities/" + PUID,
            success: function (entities) {
                printEntities(entities)
            },
            error: function () {
                alert("Entities could not be received")
            }
        })
    }
})

function printEntities(entities) {
    allEntitiesBody = ""
    if (entities) {
        for (var entity of entities) {
            allEntitiesBody += `<a href="${window.location.href.toString() + "/" + entity.euid}" class="list-group-item list-group-item-action d-flex align-items-center" style="color: #495057; font-weight: normal;">`
            if (entity.id) 
                allEntitiesBody += `<span class="badge badge-info badge-pill">${entity.id}</span> `
            allEntitiesBody += `${entity.name} <span class="badge badge-primary badge-pill">${entity.count}</span> </a>`
        }
    }

    if (!allEntitiesBody)
        allEntitiesBody = "<h1>This property have not any entity!</h1>"

    $('#entities').html(allEntitiesBody)
}


/* Add farm property */
function addFarmPropertyPopup() {
    debugger
    var addFarmPropertyFormBody = `
    <div class="container">
        <form id="addFarmPropertyForm" method="POST">
            <div class="form-group">
                <label for="">Farm Property Name</label>
                <input type="text" id="Name" name="Name" class="form-control" minlength="3" maxlength="50" required>
            </div>
            <div class="form-group">
                <label for="">Property Type</label>
                <select name="CUID" id="CUID" class="form-control">
                    <option value=""></option>
                    <option value="1">Plants</option>
                    <option value="2">Animals</option>
                </select>
            </div>
            <div class="form-group">
                <label for="">Description</label>
                <textarea id="Description" name="Description" class="form-control" rows="3"></textarea>
            </div>
            <input type="hidden" id="FUID" name="FUID" value="${window.location.href.toString().split('/').pop()}">
        </form>
    </div>`
    addFarmPropertyFormPopup = dkPopup({
        title: 'Add Farm Property',
        type: 'confirm',
        confirmClick: function () {
            submitAddFarmPropertyForm()
        },
        content: addFarmPropertyFormBody
    })
    addFarmPropertyFormValidations()
}

function submitAddFarmPropertyForm() {
    if (!$("#addFarmPropertyForm").valid()) {
        return;
    }
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($("#addFarmPropertyForm"))
    $.ajax({
        type: "POST",
        url: "/Farms/AddFarmProperty",
        data: $('#addFarmPropertyForm').serialize(),
        success: function (property) {
            if (property) {
                addFarmPropertyFormPopup.closeDkPop();
                printProperty(property)
                //window.location.href = "http://" + location.hostname + ":" + location.port + "/Farms/" + result.puid
            } else {
                alert("Farm property could not be inserted#1")
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        },
        error: function () {
            alert("Farm property could not be inserted#2")
            confirmBtn.removeAttr('disabled').removeClass('disabled')
            removeLoading()
        }
    })
}

function addFarmPropertyFormValidations() {
    $("#addFarmPropertyForm").validate({
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
            },
            CUID: {
                required: true,
            },
            FUID: {
                required: true,
            }

        }
    });
}

function printProperty(property) {
    if (property) {
        var propertyBody = `
            <div class="card">
                <div class="card-body">
                    <a href="${window.location.href.toString() + "/" + property.puid}">${property.name}</a>
                </div>
            </div>
            <br>`

        var allPropEl = $('#allProperties')
        var plantPropEl = $('#plantProperties')
        var animalPropEl = $('#animalProperties')

        if (allPropEl.hasClass('null-content')) {
            allPropEl.removeClass('null-content')
            allPropEl.html("")
        }
        allPropEl.prepend(propertyBody)
        if (property.cuid == 1) {
            if (plantPropEl.hasClass('null-content')) {
                plantPropEl.removeClass('null-content')
                plantPropEl.html("")
            }
            plantPropEl.prepend(propertyBody)
        }
        if (property.cuid == 2) {
            if (animalPropEl.hasClass('null-content')) {
                animalPropEl.removeClass('null-content')
                animalPropEl.html("")
            }
            animalPropEl.prepend(propertyBody)
        }
    }
}
/* Add farm property END */