$(document).ready(function () {
    var FUID = window.location.href.toString().split("/").pop()
    $.ajax({
        type: "GET",
        url: "/Farms/GetFarmPropertiesFromFUID/" + FUID,
        success: function (properties) {
            printProperties(properties)
        },
        error: function () {

        }
    })
})

function printAllProperties(properties) {
    body = ""
    if (properties) {
        for (var property of properties) {
            body += `
                <div class="card">
                    <div class="card-body">
                        <a href="${window.location.href.toString() + "/" + property.puid}">${property.name}</a>
                    </div>
                </div>
                <br>`
        }
    }
    debugger
    if (!body) {
        body = "<h1>This farm have not any property!</h1>"
    }

    $('#allProperties').html(body)
}

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