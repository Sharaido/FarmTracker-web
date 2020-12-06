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

    if (!allEntitiesBody) {
        allEntitiesBody = "<h1>This property have not any entity!</h1>"
        $('#entities').addClass("null-content")
    }

    $('#entities').html(allEntitiesBody)
}


/* Add farm property */
function addFarmPropertyPopup() {
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

/* Add FP Entity */
function addFPEntityPopup() {
    var formBody = `
        <div class="container">
        <form id="addFPEntityForm" method="POST">
            <div class="form-group mb-0">
                <label for="">Category</label>
                <div id="categorySelects" class="row"></div>
            </div>
            <div class="form-group">
                <label for="">Entity ID</label>
                <input type="text" id="Id" name="Id" class="form-control">
            </div>
            <div class="form-group">
                <label for="">Entity Name</label>
                <input type="text" id="Name" name="Name" class="form-control">
            </div>
            <div class="form-group">
                <label for="">Description</label>
                <textarea id="Description" name="Description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="">Count</label>
                <input type="number" id="Count" name="Count" class="form-control" min="1" value="1">
            </div>
            <div class="form-group">
                <label for="">Purchased Date</label>
                <input type="date" id="PurchasedDate" name="PurchasedDate" class="form-control">
            </div>
            <div class="form-group">
                <label for="">Cost</label>
                <input type="number" id="Cost" name="Cost" class="form-control" min="0" value="0">
            </div>
            <div id="categoryProperties"></div>
            <input type="hidden" id="PUID" name="PUID" value="${window.location.href.toString().split('/').pop()}">
            <input type="hidden" id="CUID" name="CUID" value="">
        </form>
    </div>`
    addFPEntityFormPopup = dkPopup({
        title: 'Add Entity',
        type: 'confirm',
        confirmClick: function () {
            submitAddFPEntityForm()
        },
        content: formBody
    })
    printSubCategories($('#PCUID').val())

   addFPEntityFormValidations()
}
entityFormSelectCount = 0
function printSubCategories(CUID) {
    $.ajax({
        type: "GET",
        url: "/Farms/SubCategories/" + CUID,
        success: function (categories) {
            if (categories) {
                printAddFPEntityFormSelect(categories)
            } else {
                alert("Categories could not be received #1")
            }
        },
        error: function () {
            alert("Categories could not be received #2")
        }
    })
}
function printAddFPEntityFormSelect(categories) {
    var container = $('#categorySelects')
    var selectId = "Category-" + entityFormSelectCount
    var body = `
                        <div class="col-sm-4 mb-3">
                            <select name="${selectId}" id="${selectId}" class="form-control">
                                <option value=""></option>`
    for (category of categories)
        body +=                 `<option value="${category.cuid}" data-endPointFlag="${category.endPointFlag}">${category.name}</option>`
    body += `
                            </select>
                        </div>`

    container.append(body)
    var selectEl = $('#' + selectId)
    //if (entityFormSelectCount > 2)
    //    selectEl.parent().addClass("mt-3")
    selectEl.change(function () {
        $('#CUID').val("")
        $('#categoryProperties').html("")
        selectEl.removeClass("clr-success")
        var selectNum = parseInt(selectId.split("-")[1])+1
        if (selectNum < entityFormSelectCount) {
            var l = entityFormSelectCount
            for (var i = selectNum; i < l; i++) {
                $("#Category-" + i).parent().remove()
                entityFormSelectCount--
            }
        }
        if (!selectEl.val()) {
            return
        }
        var selectedEl = $('#' + selectId + " option:selected ")
        var endPointFlag = selectedEl.attr("data-endpointflag")
        if (endPointFlag == 'false') {
            printSubCategories(selectEl.val())
        } else {
            $('#CUID').val(selectEl.val())
            getCategoryProperties(selectEl.val())
            selectEl.addClass("clr-success")
        }
    })
    entityFormSelectCount++
}

function getCategoryProperties(CUID) {
    $.ajax({
        type: "GET",
        url: "/Farms/CategoryProperties/" + CUID,
        success: function (cProperties) {
            if (cProperties) {
                printCategoryPropertiesInputs(cProperties)
                if ($("#hiddenEUID").length > 0) {
                    getEntityCPValues($("#hiddenEUID").val())
                }
            } else {
                alert("Category properties could not be received #1")
            }
        },
        error: function () {
            alert("Category properties could not be received #2")
        }
    })
}

function printCategoryPropertiesInputs(cProperties) {
    var body = ''
    for (var property of cProperties) {
        body += `
                <div class="form-group">
                    <label for="CP_${property.puid}">${property.name}</label>`
        if (property.tu.name == "string") {
            body += `<input type="text" id="CP_${property.puid}" name="CP_${property.puid}" class="form-control">`
        }
        if (property.tu.name == "date") {
            body += `<input type="date" id="CP_${property.puid}" name="CP_${property.puid}" class="form-control">`
        }
        else if (property.tu.name == "int") {
            body += `<input type="number" id="CP_${property.puid}" name="CP_${property.puid}" class="form-control">`
        }
        else if (property.tu.name == "bool") {
            body += `<input type="checkbox" id="CP_${property.puid}" name="CP_${property.puid}" class="ml-2">`
        }
        else if (property.tu.name == "select") {
            body += `
                    <select name="CP_${property.puid}" id="CP_${property.puid}" class="form-control"></select>`
            getCPSelectValues(property.puid)
        }
        
        body += `</div>`
    }

    $('#categoryProperties').html(body)
}

function getCPSelectValues(PUID) {
    $.ajax({
        type: "GET",
        url: "/Farms/COPValues/" + PUID,
        success: function (values) {
            if (values) {
                printCPSelectValues(values)
            } else {
                alert("CPSelectValues could not be received #1")
            }
        },
        error: function () {
            alert("CPSelectValues could not be received #2")
        }
    })
}

function printCPSelectValues(values) {
    var body = `<option value=""></option>`
    for (var value of values) {
        body += `<option value="${value.value}">${value.value}</option>`
    }
    $('#CP_' + values[0].puid).html(body)
}

function submitAddFPEntityForm() {
    if (!$("#addFPEntityForm").valid()) {
        return;
    }
    if (!$("#CUID").val() || $("#CUID").val() == 0) {
        $("#addFPEntityForm").prepend(`<div class="alert alert-danger" role="alert">Complete selecting category</div>`)
        return;
    }
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($("#addFPEntityForm"))
    $.ajax({
        type: "POST",
        url: "/Farms/AddFPEntity",
        data: $('#addFPEntityForm').serialize(),
        success: function (entity) {
            if (entity) {
                addFPEntityFormPopup.closeDkPop();
                printEntity(entity)
            } else {
                alert("Entity could not be inserted#1")
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        },
        error: function () {
            alert("Entity could not be inserted#2")
            confirmBtn.removeAttr('disabled').removeClass('disabled')
            removeLoading()
        }
    })
}

function addFPEntityFormValidations() {
    $("#addFPEntityForm").validate({
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
            PUID: {
                required: true,
            }

        }
    });
}

function printEntity(entity) {
    var body = ""
    body += `<a href="${window.location.href.toString() + "/" + entity.euid}" class="list-group-item list-group-item-action d-flex align-items-center" style="color: #495057; font-weight: normal;">`
    if (entity.id)
        body += `<span class="badge badge-info badge-pill">${entity.id}</span> `
    body += `${entity.name} <span class="badge badge-primary badge-pill">${entity.count}</span> </a>`
    if (!body)
        body = "<h1>This property have not any entity!</h1>"

    if ($('#entities').hasClass('null-content')) {
        $('#entities').removeClass('null-content')
        $('#entities').html("")
    }
    $('#entities').prepend(body)
}

/* Add FP Entity END */
/* Get Income and Expenses */
$(document).ready(function () {
    if ($('#incomeAndExpensesContainer').length > 0) {
        var FUID = window.location.href.toString().split("/").pop()
        $.ajax({
            type: "GET",
            url: "/Farms/IncomeAndExpeneses/" + FUID,
            success: function (incomeAndExpenses) {
                printIncomeAndExpenses(incomeAndExpenses)
            },
            error: function () {
                alert("IncomeAndExpenses could not be received")
            }
        })
    }
})

function printIncomeAndExpenses(incomeAndExpenses) {
    ieBody = ""
    iBody = ""
    eBody = ""
    
    if (incomeAndExpenses) {
        for (var iae of incomeAndExpenses) {
            var body = `<div class="list-group-item list-group-item-action" style="color: #495057; font-weight: normal;"><a href="javascript:;">`
            if (iae.incomeFlag) {
                body +=     `<span class="badge badge-primary badge-pill">${iae.cost}</span>`
            } else {
                body +=     `<span class="badge badge-danger badge-pill">${iae.cost}</span>`
            }
            body +=         `${iae.head}
                            </a>
                            <a href="javascript:deleteIAEPopup('${iae.head}', '${iae.ieuid}');" class="float-right"><i class="fa fa-times clr-danger"></i></a>
                        </div>`

            ieBody += body
            if (iae.incomeFlag)
                iBody += body
            else
                eBody += body
        }
    }
    if (!ieBody) {
        ieBody = "<h1>This farm have not any income or expense!</h1>"
        $('#incomeAndExpensesContainer').addClass('null-content')
    }
    if (!iBody) {
        iBody = "<h1>This farm have not any income!</h1>"
        $('#incomesContainer').addClass('null-content')
    }
    if (!eBody) {
        eBody = "<h1>This farm have not any expense!</h1>"
        $('#expensesContainer').addClass('null-content')
    }

    $('#incomeAndExpensesContainer').html(ieBody)
    $('#incomesContainer').html(iBody)
    $('#expensesContainer').html(eBody)
}
/* Get Income and Expenses END */
/* Add Income and Expense */
function addIncomeOrExpensePopup(incomeFlag) {
    var formBody = `
    <div class="container">
        <form id="addIncomeOrExpenseForm" method="POST">
            <div class="form-group">
                <label for="Head">Head</label>
                <input type="text" id="Head" name="Head" class="form-control">
            </div>
            <div class="form-group">
                <label for="">Description</label>
                <textarea id="Description" name="Description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="">Date</label>
                <input type="date" id="Date" name="Date" class="form-control">
            </div>
            <div class="form-group">
                <label for="">Cost</label>
                <input type="number" id="Cost" name="Cost" class="form-control">
            </div>
            <input type="hidden" id="FUID" name="FUID" value="${window.location.href.toString().split('/').pop()}">
        </form>
    </div>`

    var popupTitle = ""
    if (incomeFlag) {
        popupTitle += `<label for="Head">Add Income</label>`
    } else {
        popupTitle += `<label for="Head">Add Expense</label>`
    }  

    addIncomeOrExpenseFormPopup = dkPopup({
        title: popupTitle,
        type: 'confirm',
        confirmClick: function () {
            submitAddIncomeOrExpenseForm(incomeFlag)
        },
        content: formBody
    })
    addIncomeOrExpenseFormValidations()
}
function addIncomeOrExpenseFormValidations() {
    $("#addIncomeOrExpenseForm").validate({
        onsubmit: false,
        errorClass: "clr-danger",
        rules: {
            Head: {
                required: true,
                minlength: 3,
                maxlength: 50
            },
            Description: {
                maxlength: 255
            },
            Cost: {
                required: true,
            },
            FUID: {
                required: true,
            }

        }
    });
}
function submitAddIncomeOrExpenseForm(incomeFlag) {
    if (!$("#addIncomeOrExpenseForm").valid()) {
        return;
    }
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($("#addIncomeOrExpenseForm"))
    var ajaxUrl = ""
    if (incomeFlag) {
        ajaxUrl = "/Farms/AddIncome"
    } else {
        ajaxUrl = "/Farms/AddExpense"
    }
    $.ajax({
        type: "POST",
        url: ajaxUrl,
        data: $('#addIncomeOrExpenseForm').serialize(),
        success: function (ioe) {
            if (ioe) {
                addIncomeOrExpenseFormPopup.closeDkPop();
                printIncomeOrExpense(ioe)
            } else {
                alert("IncomeOrExpense could not be inserted#1")
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        },
        error: function () {
            alert("IncomeOrExpense could not be inserted#2")
            confirmBtn.removeAttr('disabled').removeClass('disabled')
            removeLoading()
        }
    })
}
function printIncomeOrExpense(ioe) {
    var iaeEl = $('#incomeAndExpensesContainer')
    var iEl = $('#incomesContainer')
    var eEl = $('#expensesContainer')

    var body =  `<div class="list-group-item list-group-item-action" style="color: #495057; font-weight: normal;"><a href="javascript:;">`
    if (ioe.incomeFlag) {
        body +=     `<span class="badge badge-primary badge-pill">${ioe.cost}</span>`
    } else {
        body +=     `<span class="badge badge-danger badge-pill">${ioe.cost}</span>`
    }
    body +=         `${ioe.head}
                    </a>
                    <a href="javascript:deleteIAEPopup('${ioe.head}', '${ioe.ieuid}');" class="float-right"><i class="fa fa-times clr-danger"></i></a>
                </div>`

    if (iaeEl.hasClass('null-content')) {
        iaeEl.removeClass('null-content')
        iaeEl.html("")
    }
    iaeEl.prepend(body)
    if (ioe.incomeFlag) {
        if (iEl.hasClass('null-content')) {
            iEl.removeClass('null-content')
            iEl.html("")
        }
        iEl.prepend(body)
    } else {
        if (eEl.hasClass('null-content')) {
            eEl.removeClass('null-content')
            eEl.html("")
        }
        eEl.prepend(body)
    }

}
/* Add Income and Expense END */
/* Delete Farm */
function deleteFarmPopup(name) {
    deleteFarmPopupEl = dkPopup({
        model: 'simple-confirm',
        title: 'Delete Farm',
        type: 'confirm',
        confirmClick: function () {
            deleteFarm(window.location.href.toString().split("/").pop())
        },
        content: `Do you want to delete ${name}`
    })
}
function deleteFarm(FUID) {
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($(".dk-popup"))
    $.ajax({
        type: "DELETE",
        url: "/Farms/" + FUID,
        success: function (result) {
            if (result) {
                window.location.href = "http://" + location.hostname + ":" + location.port
            } else {
                alert("Farm could not be deleted #1")
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        },
        error: function () {
            alert("Farm could not be deleted #2")
            confirmBtn.removeAttr('disabled').removeClass('disabled')
            removeLoading()
        }
    })
}
/* Delete Farm END */
/* Delete Farm Property */
function deleteFarmPropertyPopup(name) {
    deleteFarmPropertyPopupEl = dkPopup({
        model: 'simple-confirm',
        title: 'Delete Farm Property',
        type: 'confirm',
        confirmClick: function () {
            deleteFarmProperty(window.location.href.toString().split("/").pop())
        },
        content: `Do you want to delete ${name}`
    })
}
function deleteFarmProperty(PUID) {
    var arr = window.location.href.toString().split("/")
    arr.pop()
    var FUID = arr.pop()
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($(".dk-popup"))
    $.ajax({
        type: "DELETE",
        url: "/Farms/Properties/" + PUID,
        success: function (result) {
            if (result) {
                window.location.href = "http://" + location.hostname + ":" + location.port + "/Farms/" + FUID
            } else {
                alert("Farm property could not be deleted #1")
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        },
        error: function () {
            alert("Farm property could not be deleted #2")
            confirmBtn.removeAttr('disabled').removeClass('disabled')
            removeLoading()
        }
    })
}
/* Delete Farm Property END */
/* Delete FP Entity */
function deleteFPEntityPopup(name) {
    deleteFPEntityPopupEl = dkPopup({
        model: 'simple-confirm',
        title: 'Delete Entity',
        type: 'confirm',
        confirmClick: function () {
            deleteFPEntity(window.location.href.toString().split("/").pop())
        },
        content: `Do you want to delete ${name}`
    })
}
function deleteFPEntity(EUID) {
    var arr = window.location.href.toString().split("/")
    arr.pop()
    var PUID = arr.pop()
    var FUID = arr.pop()
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($(".dk-popup"))
    $.ajax({
        type: "DELETE",
        url: "/Farms/Properties/Entities/" + EUID,
        success: function (result) {
            if (result) {
                window.location.href = "http://" + location.hostname + ":" + location.port + "/Farms/" + FUID + "/" + PUID
            } else {
                alert("FPEntity could not be deleted #1")
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        },
        error: function () {
            alert("FPEntity could not be deleted #2")
            confirmBtn.removeAttr('disabled').removeClass('disabled')
            removeLoading()
        }
    })
}
/* Delete FP Entity END */
/* Delete IncomeAndExpenses */
function deleteIAEPopup(name, IEUID) {
    deleteIAEPopupEl = dkPopup({
        model: 'simple-confirm',
        title: 'Delete Income Or Expense',
        type: 'confirm',
        confirmClick: function () {
            deleteIAE(IEUID)
        },
        content: `Do you want to delete ${name}`
    })
}
function deleteIAE(IEUID) {
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($(".dk-popup"))
    $.ajax({
        type: "DELETE",
        url: "/Farms/IAE/" + IEUID,
        success: function (result) {
            if (result) {
                window.location.reload()
            } else {
                alert("Income Or Expense could not be deleted #1")
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        },
        error: function () {
            alert("Income Or Expense could not be deleted #2")
            confirmBtn.removeAttr('disabled').removeClass('disabled')
            removeLoading()
        }
    })
}
/* Delete FP Entity END */
/* FP Entity Details */

$(document).ready(function () {
    if ($("#categoryProperties").length > 0) {
        getCategoryProperties($("#hiddenCUID").val())
    }
})
function getEntityCPValues(EUID) {
    $.ajax({
        type: "GET",
        url: "/Farms/EntityCOPValues/" + EUID,
        success: function (values) {
            if (values) {
                printEntityCPValues(values)
            } else {
                
            }
        },
        error: function () {
            alert("EntityCOPValues could not be received #2")
        }
    })
}
function printEntityCPValues(values) {
    for (value of values) {
        $('#CP_' + value.puid).val(value.value)
    }
}



$(document).ready(function () {
    if ($("#entityDetails").length > 0) {
        getEntityDetails($("#hiddenEUID").val())
    }
})

function getEntityDetails(EUID) {
    $.ajax({
        type: "GET",
        url: "/Farms/EntityDetails/" + EUID,
        success: function (values) {
            printEntityDetails(values)
        },
        error: function () {
            alert("EntityDetails could not be received #2")
        }
    })
}
function printEntityDetails(values) {
    var body = ''
    if (values) {
        for (detail of values) {
            var popoverBody = `${detail.description}`
            if (detail.cost) {
                popoverBody += `${detail.description} <br/> <b>Cost: </b> ${detail.cost}`
            }
            if (detail.remainderDate) {
                popoverBody += `${detail.description} <br/> <b>Remainer Date : </b> ${detail.remainderDate.replace('T', ' ')}`
                if (detail.remainderCompletedFlag) {
                    popoverBody += `<br/> <b>Completed Date: </b>${detail.remainderCompletedDate.replace('T', ' ')}`
                }
            }
            body += `<div class="list-group-item list-group-item-action" style="color: #495057; font-weight: normal; cursor:default"
                        data-toggle="popover" data-html="true" data-trigger="hover" title="${detail.name}" data-content="${popoverBody}" >`
            if (detail.remainderDate) {
                if (detail.remainderCompletedFlag) {
                    body += `<span class="badge badge-success badge-pill">${detail.remainderCompletedDate.replace('T', ' ')}</span>`
                } else {
                    body += `<span class="badge badge-primary badge-pill">${detail.remainderDate.replace('T', ' ')}</span>`
                }
            }
            body += `${detail.name}
                </div>`
        }
    }
    if (!body) {
        body = "<h3>This entity have not any detail!</h3>"
        $('#entityDetails').addClass('null-content')
    }

    $("#entityDetails").html(body)
    $('[data-toggle="popover"]').popover()
}
/* FP Entity Details END */
/* Add Entity Details */
function addEntityDetailPopup() {
    var formBody = `
    <div class="container">
        <form id="addEntityDetailForm" method="POST">
            <div class="form-group">
                <label for="Name">Name</label>
                <input type="text" id="Name" name="Name" class="form-control">
            </div>
            <div class="form-group">
                <label for="Description">Description</label>
                <textarea id="Description" name="Description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="Cost">Cost</label>
                <input type="number" id="Cost" name="Cost" class="form-control">
            </div>
            <div class="form-group">
                <label for="ExpenseFlag"><input type="checkbox" id="ExpenseFlag" name="ExpenseFlag" value="true" checked> Add expenses</label>
            </div>
            <input type="hidden" id="EUID" name="EUID" value="${$('#hiddenEUID').val()}">
        </form>
    </div>`
    addEntityDetailPopupEl = dkPopup({
        title: 'Add Entity Detail',
        type: 'confirm',
        confirmClick: function () {
            submitAddEntityDetailForm()
        },
        content: formBody
    })
    addAddEntityDetailFormValidations()
}
function addAddEntityDetailFormValidations() {
    $("#addEntityDetailForm").validate({
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
        }
    });
}
function submitAddEntityDetailForm() {
    if (!$("#addEntityDetailForm").valid()) {
        return;
    }
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($("#addEntityDetailForm"))
    $.ajax({
        type: "POST",
        url: "/Farms/EntityDetails",
        data: $('#addEntityDetailForm').serialize(),
        success: function (detail) {
            if (detail) {
                addEntityDetailPopupEl.closeDkPop();
                printEntityDetail(detail)
                removeLoading()
            } else {
                alert("Entity detail could not be inserted#1")
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        },
        error: function () {
            alert("Entity detail not be inserted#2")
            confirmBtn.removeAttr('disabled').removeClass('disabled')
            removeLoading()
        }
    })
}
function printEntityDetail(detail) {
    var popoverBody = `${detail.description}`
    if (detail.cost) {
        popoverBody += `${detail.description} <br/> <b>Cost: </b> ${detail.cost}`
    }
    if (detail.remainderDate) {
        popoverBody += `${detail.description} <br/> <b>Remainer Date : </b> ${detail.remainderDate.replace('T', ' ')}`
        if (detail.remainderCompletedFlag) {
            popoverBody += `<br/> <b>Completed Date: </b>${detail.remainderCompletedDate.replace('T', ' ')}`
        }
    }
    body += `<div class="list-group-item list-group-item-action" style="color: #495057; font-weight: normal; cursor:default"
                        data-toggle="popover" data-html="true" data-trigger="hover" title="${detail.name}" data-content="${popoverBody}" >`
    if (detail.remainderDate) {
        if (detail.remainderCompletedFlag) {
            body += `<span class="badge badge-success badge-pill">${detail.remainderCompletedDate.replace('T', ' ')}</span>`
        } else {
            body += `<span class="badge badge-primary badge-pill">${detail.remainderDate.replace('T', ' ')}</span>`
        }
    }
    body += `${detail.name}
                </div>`

    var containerEl = $('#entityDetails')
    if (containerEl.hasClass('null-content')) {
        containerEl.removeClass('null-content')
        containerEl.html("")
    }
    containerEl.prepend(body)
}

/* Add Entity Details END */
