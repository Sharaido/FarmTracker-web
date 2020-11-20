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
    if (!allBody) 
        allBody = "<h1>This farm have not any property!</h1>"
    if (!plantBody)
        plantBody = "<h1>This farm have not any plant property!</h1>"
    if (!animalBody)
        animalBody = "<h1>This farm have not any animal property!</h1>"

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
            allEntitiesBody += `<a href="${window.location.href.toString() + "/" + entity.puid}" class="list-group-item list-group-item-action d-flex align-items-center" style="color: #495057; font-weight: normal;">`
            if (entity.id) 
                allEntitiesBody += `<span class="badge badge-info badge-pill">${entity.id}</span> `
            allEntitiesBody += `${entity.name} <span class="badge badge-primary badge-pill">${entity.count}</span> </a>`
        }
    }

    if (!allEntitiesBody)
        allEntitiesBody = "<h1>This property have not any entity!</h1>"

    $('#entities').html(allEntitiesBody)
}
