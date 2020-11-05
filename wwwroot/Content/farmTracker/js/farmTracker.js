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
    for (var farm of farms)
        body +=     `<li><a href="/Farms/${farm.fuid}">${farm.name}</a></li>`   
    body +=     `<li><a href="javascript:;">Add Farm</li>`
    body +=   `</ul>`
    $('#farmLinks').html(body)
    addNestedLinks($('#dk-nav')[0])
}