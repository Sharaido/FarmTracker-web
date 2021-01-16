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
    if ($('#lastIoeContainer').length > 0) {

    }
})

function printProperties(properties) {
    allBody = ""
    if (properties) {
        for (var property of properties) {
            var propertyBody = getPropertyBody(property)

            allBody += propertyBody
        }
    }
    if (!allBody) {
        allBody = "<h1>This farm have not any property!</h1>"
        $('#allProperties').addClass('null-content')
    }
    $('#allProperties .out-of-middle').remove()
    $('#allProperties').append(allBody)
}
function getPropertyBody(property) {
    var date = ""
    if (property.lastModifiedDate) {
        date = property.lastModifiedDate.toString().replace("T", " ").substring(0, 16)
    }
    if (!property.description) {
        property.description = "No description"
    }
    var body = `<a href="${window.location.href.toString() + "/" + property.puid}" class="property-item">
						<img src="../Content/farmTracker/img/system/${property.cu.pic}" alt="">
						<div class="property-name">${property.name}</div>
						<div class="property-desc">${property.description}</div>
						<div class="property-last-modified">Last modified: ${date}</div>
				</a>`

    return body
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
    console.log(entities)
    allEntitiesBody = ""
    if (entities) {
        for (var entity of entities) {
            allEntitiesBody += getEntityBody(entity)
        }
    }

    if (!allEntitiesBody) {
        allEntitiesBody = "<h1>This property have not any entity!</h1>"
        $('#entities').addClass("null-content")
    }

    $('#entities').html(allEntitiesBody)
}
function getEntityBody(entity) {
    var date = ""
    if (entity.lastModifiedDate) {
        date = entity.lastModifiedDate.toString().replace("T", " ").substring(0, 16)
    }
    if (!entity.id) {
        entity.id = "No Id"
    }
    if (entity.count > 1) {
        entity.name = entity.count + "x "+ entity.name
    }
    var body = `<a href="${window.location.href.toString() + "/" + entity.euid}" class="entity-item">
						<img src="../../Content/farmTracker/img/system/${entity.cu.pic}" alt="">
						<div class="entity-name">${entity.name}</div>
						<div class="entity-id"><b>ID: </b>${entity.id}</div>
						<div class="entity-last-modified">Last modified: ${date}</div>
				</a>`

    return body
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
                    <option value="40">Terrestrial Plants</option>
                    <option value="38">Terrestrial Animals</option>
                    <option value="39">Aquatic Plants</option>
                    <option value="37">Aquatic Animals</option>
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
        var propertyBody = getPropertyBody(property)
        var allPropEl = $('#allProperties')
        if (allPropEl.hasClass('null-content')) {
            allPropEl.removeClass('null-content')
            allPropEl.html("")
        }
        allPropEl.prepend(propertyBody)
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
            if ($('#categoryProperties').length > 0) {
                getCategoryProperties(selectEl.val())
            }
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
            }
        },
        error: function () {
            alert("Category properties could not be received #2")
        }
    })
}

function printCategoryPropertiesInputs(cProperties) {
    console.log(cProperties)
    var body = ''
    for (var property of cProperties) {
        body += `
                <div class="form-group">
                    <label for="CP_${property.puid}"><b>${property.name}</b></label>`
        if (property.tu.name == "string") {
            body += `<input type="text" id="CP_${property.puid}" name="CP_${property.puid}" class="form-control" data-cp-id="${property.puid}">`
        }
        if (property.tu.name == "date") {
            body += `<input type="date" id="CP_${property.puid}" name="CP_${property.puid}" class="form-control" data-cp-id="${property.puid}">`
        }
        else if (property.tu.name == "int") {
            body += `<input type="number" id="CP_${property.puid}" name="CP_${property.puid}" class="form-control" data-cp-id="${property.puid}">`
        }
        else if (property.tu.name == "bool") {
            body += `<input type="checkbox" id="CP_${property.puid}" name="CP_${property.puid}" class="ml-2" data-cp-id="${property.puid}">`
        }
        else if (property.tu.name == "select") {
            body += `
                    <select name="CP_${property.puid}" id="CP_${property.puid}" class="form-control" data-cp-id="${property.puid}"></select>`
            getCPSelectValues(property.puid)
        }
        
        body += `</div>`
    }

    $('#categoryProperties').html(body)
    cpUpdateEvents()
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
    var body = getEntityBody(entity)
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
    if ($('#lastIoeContainer').length > 0) {
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
    var lastIoaBody = ""
    var lastCount = 0
    var iBody = ""
    var eBody = ""
    
    if (incomeAndExpenses) {
        for (var iae of incomeAndExpenses) {
            var body = getIoeBody(iae)

            if (iae.incomeFlag)
                iBody += body
            else
                eBody += body

            if (lastCount < 10) {
                lastIoaBody += body
            }
            lastCount++
        }
    }
    if (!lastIoaBody) {
        lastIoaBody = "<p>This farm have not any income or expense!</p>"
        $('#lastIoeContainer').addClass('null-content')
    }
    if (!iBody) {
        iBody = "<h1>This farm have not any income!</h1>"
        $('#incomesContainer').addClass('null-content')
    }
    if (!eBody) {
        eBody = "<h1>This farm have not any expense!</h1>"
        $('#expensesContainer').addClass('null-content')
    }

    $('#lastIoeContainer').html(lastIoaBody)
    $('#incomesContainer').html(iBody)
    $('#expensesContainer').html(eBody)


    $('[data-toggle="popover"]').popover()
}
function getIoeBody(ioe) {
    var clr = "danger"
    if (ioe.incomeFlag) {
        clr = "success"
    }
    var popoverBody = ``
    if (ioe.description) {
        popoverBody += `${ioe.description} </br>`
    }
    if (ioe.date) {
        popoverBody += `<b>Date: </b>${ioe.date.toString().replace("T", " ").substring(0, 16)} </br>`
    }
    popoverBody += `<b>Cost: </b>$${ioe.cost} </br>`
    popoverBody += `<b>Created By: </b>@${ioe.createdByUu.username} </br>`

    var body = `<div class="ioe-item " data-toggle="popover" data-html="true" data-trigger="hover" title="${ioe.head}" data-content="${popoverBody}" data-iae-id="${ioe.ieuid}">
					<div>
						<i class="fa fa-money-bill-alt clr-${clr}"></i>
						<div class="ioe-cost">$${ioe.cost}</div>
						<div class="ioe-name">${ioe.head}</div>
					</div>
					<div class="ioe-delete"><a href="javascript:deleteIAEPopup('${ioe.head}', '${ioe.ieuid}');"><i class="fa fa-times"></i></a></div>
				</div>`

    return body
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
    var iaeEl = $('#lastIoeContainer')
    var iEl = $('#incomesContainer')
    var eEl = $('#expensesContainer')

    var body = getIoeBody(ioe)

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

    $('[data-toggle="popover"]').popover()

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
        content: `Do you want to delete <strong>${name}</strong>`
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
        content: `Do you want to delete <strong>${name}</strong>`
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
        content: `Do you want to delete <strong>${name}</strong>`
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
        content: `Do you want to delete <strong>${name}</strong>`
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
                $(`[data-iae-id="${IEUID}"]`).remove()
                deleteIAEPopupEl.closeDkPop();
                removeLoading()
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
    if ($("#categoryProperties").length > 0 && $("#hiddenCUID").length > 0 && $("#hiddenCUID").val()) {
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
        if (value.value == "on") {
            $('#CP_' + value.puid).attr("checked", "checked")
        } else if (value.value == "off") {

        } else {
            $('#CP_' + value.puid).val(value.value)
        }
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
            body += createEntityDetailBody(detail)
        }
    }
    if (!body) {
        body = "<h3>This entity have not any detail!</h3>"
        $('#entityDetails').addClass('null-content')
    }

    $("#entityDetails").html(body)
    $('[data-toggle="popover"]').popover()
}

function createEntityDetailBody(detail) {
    var body = ''
    var popoverBody = ''
    if (detail.description) {
        popoverBody += `${detail.description}`
    }
    if (detail.cost) {
        popoverBody += `<br/> <b>Cost: </b> ${detail.cost}`
    }
    if (detail.remainderDate) {
        popoverBody += `<br/> <b>Remainer Date : </b> ${detail.remainderDate.replace('T', ' ')}`
        if (detail.remainderCompletedFlag) {
            popoverBody += `<br/> <b>Completed Date: </b>${detail.remainderCompletedDate.replace('T', ' ')}`
        }
    }

    var icon = "far fa-file-alt"
    var remainderCompleteBtn = ``
    if (detail.remainderDate) {
        if (detail.remainderCompletedFlag) {
            icon = `far fa-clock clr-success`
        } else {
            icon = `far fa-clock clr-primary`
            remainderCompleteBtn = `<a href="javascript:completeRemainder('${detail.duid}');"><i class="fa fa-check-circle clr-primary mr-3"></i></a>`
        }
    }
    if (detail.cost) {
        icon = `far fa-money-bill-alt clr-danger`
    }



    body += `<div class="entityd-item" data-entity-detail-id="${detail.duid}" data-toggle="popover" data-html="true" data-trigger="hover" title="${detail.name}" data-content="${popoverBody}" >
				<div>
					<i class="${icon}"></i>
					<div>
						<div class="entityd-name">${detail.name}</div>
						<div>
							<div class="entityd-date">${detail.createdDate.replace('T', ' ')}</div>
						</div>
					</div>
				</div>
				<div class="entityd-delete">
                    ${remainderCompleteBtn}
                    <a href="javascript:deleteEntityDetailPopup('${detail.name}', '${detail.duid}');"><i class="fa fa-times"></i></a>
                </div>
			</div>`
        
    return body
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
    console.log(detail)
    var body = createEntityDetailBody(detail)
    console.log(body)
    var containerEl = $('#entityDetails')
    if (containerEl.hasClass('null-content')) {
        containerEl.removeClass('null-content')
        containerEl.html("")
    }
    containerEl.prepend(body)
    $('[data-toggle="popover"]').popover()
}
/* Add Entity Details END */
/* Add Entity Remainder */
function addRemainderPopup() {
    var formBody = `
    <div class="container">
        <form id="addRemainderForm" method="POST">
            <div class="form-group">
                <label for="Name">Name</label>
                <input type="text" id="Name" name="Name" class="form-control">
            </div>
            <div class="form-group">
                <label for="Description">Description</label>
                <textarea id="Description" name="Description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="RDate">Remainder Date</label>
                <input type="date" id="RDate" name="RDate" class="form-control">
            </div>
            <div class="form-group">
                <label for="RTime">Remainder Time</label>
                <input type="time" id="RTime" name="RTime" class="form-control">
            </div>
            <input type="hidden" id="EUID" name="EUID" value="${$('#hiddenEUID').val()}">
        </form>
    </div>`
    addRemainderPopupEl = dkPopup({
        title: 'Add Remainder',
        type: 'confirm',
        confirmClick: function () {
            submitAddRemainderForm()
        },
        content: formBody
    })
    addRemainderFormValidations()
}
function addRemainderFormValidations() {
    $("#addRemainderForm").validate({
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
            RDate: {
                required: true
            },
            RTime: {
                required: true
            }
        }
    });
}
function submitAddRemainderForm() {
    if (!$("#addRemainderForm").valid()) {
        return;
    }
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($("#addRemainderForm"))
    $.ajax({
        type: "POST",
        url: "/Farms/EntityDetails",
        data: $('#addRemainderForm').serialize(),
        success: function (detail) {
            if (detail) {
                addRemainderPopupEl.closeDkPop();
                printEntityDetail(detail)
                removeLoading()
            } else {
                alert("Remainder could not be inserted#1")
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        },
        error: function () {
            alert("Remainder not be inserted#2")
            confirmBtn.removeAttr('disabled').removeClass('disabled')
            removeLoading()
        }
    })
}

/* Add Entity Remainder END */
/* Get Farm Entities */
$(document).ready(function () {
    if ($('#productsContainer').length > 0) {
        var FUID = window.location.href.toString().split("/").pop()
        $.ajax({
            type: "GET",
            url: "/Farms/FarmEntities/" + FUID,
            success: function (entities) {
                if (entities) {
                    printFarmEntities(entities)
                } else {
                    $('#productsContainer').addClass('null-content')
                    $('#productsContainer').html("This farm have not any products!")
                }
            }
        })
    }
})
function printFarmEntities(entities) {
    var body = ""
    for (i of entities) {
        body += getFarmEntityBody(i)
    }
    $('#productsContainer').html(body)
}
function getFarmEntityBody(entity) {
    var body = `<div class="product-item" data-farm-entity-id="${entity.euid}">
				    <div>
					    <i class="fa fa-tools"></i>
					    <div class="product-name">${entity.count}x ${entity.name}</div>
				    </div>
				    <div class="product-delete"><a href="javascript:deleteFarmEntityPopup('${entity.name}', '${entity.euid}');"><i class="fa fa-times"></i></a></div>
			    </div>`
    return body
}
/* Get Farm Entities END */
/* Add Farm Entities */
function addFarmEntityPopup() {
    var FUID = window.location.href.toString().split("/").pop()
    var formBody = `
    <div class="container">
        <form id="addFarmEntityForm" method="POST">
            <div class="form-group mb-0">
                <label for="">Category</label>
                <div id="categorySelects" class="row"></div>
            </div>
            <div class="form-group">
                <label for="Name">Name</label>
                <input type="text" id="Name" name="Name" class="form-control">
            </div>
            <div class="form-group">
                <label for="Count">Count</label>
                <input type="number" id="Count" name="Count" class="form-control" value="1">
            </div>
            <input type="hidden" id="FUID" name="FUID" value="${FUID}">
            <input type="hidden" id="CUID" name="CUID" value="">
        </form>
    </div>`
    dkPopupElAddFarmEntity = dkPopup({
        title: 'Add Product',
        type: 'confirm',
        confirmClick: function () {
            submitaddFarmEntityForm()
        },
        content: formBody
    })
    printSubCategories("20")
}
function submitaddFarmEntityForm() {
    if (!$("#CUID").val() || $("#CUID").val() == 0) {
        $("#addFarmEntityForm").prepend(`<div class="alert alert-danger" role="alert">Complete selecting category</div>`)
        return;
    }
    if (!$('#addFarmEntityForm #Name').val()) {
        $('#addFarmEntityForm #Name').val($('#addFarmEntityForm [data-endpointflag = "true"]:selected').text())
    }
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($(".dk-popup"))
    $.ajax({
        type: "POST",
        url: "/Farms/FarmEntities",
        data: $('#addFarmEntityForm').serialize(),
        success: function (entity) {
            if (entity) {
                dkPopupElAddFarmEntity.closeDkPop();
                printFarmEntity(entity)
                removeLoading()
            } else {
                alert("Farm entity could not be inserted#1")
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        }
    })
}
function printFarmEntity(i) {
    if ($('#productsContainer').hasClass('null-content')) {
        $('#productsContainer').removeClass('null-content')
        $('#productsContainer').html('')
    }
    var body = getFarmEntityBody(i)
    $('#productsContainer').prepend(body)
}
/* Add Farm Entities END */
/* Delete Farm Entities */
function deleteFarmEntityPopup(name, EUID, e) {
    dkPopupElDeleteFarmEntity = dkPopup({
        model: 'simple-confirm',
        title: 'Delete Farm Entity',
        type: 'confirm',
        confirmClick: function () {
            deleteFarmEntity(EUID)
        },
        content: `Do you want to delete <strong>${name}</strong>`
    })
}
function deleteFarmEntity(EUID) {
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($(".dk-popup"))
    $.ajax({
        type: "DELETE",
        url: "/Farms/FarmEntities/" + EUID,
        success: function (result) {
            if (result) {
                $(`[data-farm-entity-id="${EUID}"]`).remove()
                dkPopupElDeleteFarmEntity.closeDkPop();
                removeLoading()
            } else {
                alert("FarmEntity could not be deleted #1")
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        }
    })
}
/* Delete Farm Entities END */


/* Get Collaborators */
$(document).ready(function () {
    if ($('#farmCollaborators').length > 0) {
        var FUID = window.location.href.toString().split("/").pop()
        $.ajax({
            type: "GET",
            url: "/Farms/Collaborators/" + FUID,
            success: function (collaborators) {
                if (collaborators) {
                    printCollaborators(collaborators)
                } else {
                    $('#farmCollaborators').addClass('null-content')
                    $('#farmCollaborators').html("This farm have not any collaborator!")
                    $('#collaboratorsContainer').addClass('null-content')
                    $('#collaboratorsContainer').html("This farm have not any collaborator!")
                }
            }
        })
    }
})
function printCollaborators(collaborators) {
    var body = ""
    for (i of collaborators) {
        body += getCollaboratorBody(i)
    }
    $('#farmCollaborators').html(body)
    $('#collaboratorsContainer').html(body)
}
function getCollaboratorBody(collaborator) {
    if (!collaborator.uu.profilePic) {
        collaborator.uu.profilePic = "profil_pic.png"
    }
    var body = `<div class="collaborator-item" data-collaborator-user-id="${collaborator.uu.uuid}">
					<div>
						<img src="../Content/img/userProfilPics//${collaborator.uu.profilePic}" alt="">
						<div>
							<div class="collaborator-name">${collaborator.uu.name} ${collaborator.uu.surname}</div>
							<div>
								<div class="collaborator-username">@${collaborator.uu.username}</div>
								<div class="collaborator-role">${collaborator.ru.name}</div>
							</div>
						</div>
					</div>
					<div class="collaborator-delete"><a href="javascript:deleteCollaboratorPopup('${collaborator.uu.username}', '${collaborator.uuid}');"><i class="fa fa-times"></i></a></div>
				</div>`

    return body
}
/* Get Collaborators END */
/* Add Collaborator */
function addCollaboratorPopup() {
    var FUID = window.location.href.toString().split("/").pop()
    var formBody = `
    <div class="container">
        <div id="addCollaboratorWarn"></div>
        <form id="searchUser" method="POST">
            <div class="form-group">
                <label for="key">Search User</label>
                <input type="text" class="form-control" id="key" required>
            </div>
            <input type="submit" value="Search" id="searchUserBtn" class="btn btn-primary">
        </form>
        <br/>
        <form id="addCollaborator" method="POST">
            <div class="form-group">
                <label>Users</label>
                <div id="searchUserResults">Search User</div>
            </div>
            <div class="form-group">
                <label for="RUID">Role</label>
                <select name="RUID" id="RUID" class="form-control">
                    
                </select>
            </div>
            <input type="hidden" id="FUID" name="FUID" value="${FUID}">
        </form>
    </div>`
    dkPopupElAddCollaborator = dkPopup({
        title: 'Add Collaborator',
        type: 'confirm',
        confirmClick: function () {
            submitAddCollaboratorForm()
        },
        content: formBody
    })

    getCollaboratorRoles()

    $('#searchUser').submit(() => {
        $.ajax({
            type: "GET",
            url: "/Members/SearchUser/" + $('#searchUser #key').val(),
            success: function (users) {
                if (users) {
                    printUsers(users)
                    removeLoading()
                } else {
                    $('#searchUserResults').html(`Any user not found!`)
                    confirmBtn.removeAttr('disabled').removeClass('disabled')
                    removeLoading()
                }
            }
        })
        return false
    })
}
function submitAddCollaboratorForm() {
    if (!$('#addCollaborator [name = "UUID"]:checked').val()) {
        $('#addCollaboratorWarn').html(`<div class="alert alert-danger" role="alert">Select user!</div>`)
        return
    }
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($(".dk-popup"))
    $.ajax({
        type: "POST",
        url: "/Farms/Collaborators",
        data: $('#addCollaborator').serialize(),
        success: function (collaborator) {
            if (collaborator) {
                dkPopupElAddCollaborator.closeDkPop();
                printCollaborator(collaborator)
                removeLoading()
            } else {
                $('#addCollaboratorWarn').html(`<div class="alert alert-danger" role="alert">User could be inserted already! Farm owner cannot be inserted as a collaborator!</div>`)
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        }
    })
}
function printCollaborator(i) {
    if ($('#farmCollaborators').hasClass('null-content')) {
        $('#farmCollaborators').removeClass('null-content')
        $('#farmCollaborators').html('')
    }
    if ($('#collaboratorsContainer').hasClass('null-content')) {
        $('#collaboratorsContainer').removeClass('null-content')
        $('#collaboratorsContainer').html('')
    }

    var body = getCollaboratorBody(i)
    $('#farmCollaborators').prepend(body)
    $('#collaboratorsContainer').prepend(body)
}
function printUsers(users) {
    var body = ''
    for (i of users) {
        body += `<label class="form-control"><input type="radio" name="UUID" value="${i.uuid}"/>@${i.username} - ${i.name} ${i.surname}</label>`
    }

    $('#searchUserResults').html(body)
}
function getCollaboratorRoles() {
    $.ajax({
        type: "GET",
        url: "/Farms/CollaboratorRoles",
        success: function (roles) {
            if (roles) {
                var body = ""
                for (i of roles) {
                    body += `<option value="${i.ruid}">${i.name}</option>`
                }
                $('#RUID').html(body)
            }
        }
    })
}
/* Add Collaborator END */
/* Delete Collaborator */
function deleteCollaboratorPopup(username, UUID, e) {
    var FUID = window.location.href.toString().split("/").pop()
    dkPopupElDeleteCollaborator = dkPopup({
        model: 'simple-confirm',
        title: 'Remove Collaborator',
        type: 'confirm',
        confirmClick: function () {
            deleteCollaborator(UUID, FUID)
        },
        content: `Do you want to remove <strong>@${username}</strong> from collaborators`
    })
}
function deleteCollaborator(UUID, FUID) {
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($(".dk-popup"))
    $.ajax({
        type: "DELETE",
        url: "/Farms/Collaborators/",
        data: {
            "UUID": UUID,
            "FUID": FUID
        },
        success: function (result) {
            if (result) {
                $(`[data-collaborator-user-id="${UUID}"]`).remove()
                dkPopupElDeleteCollaborator.closeDkPop();
                removeLoading()
            } else {
                alert("Collaborator could not be deleted #1")
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        }
    })
}
/* Delete Collaborator END */

/* Delete Entity Detail */
function deleteEntityDetailPopup(name, DUID, e) {
    dkPopupElDeleteEntityDetail = dkPopup({
        model: 'simple-confirm',
        title: 'Delete Entity Update',
        type: 'confirm',
        confirmClick: function () {
            deleteEntityDetail(DUID)
        },
        content: `Do you want to delete <strong>${name}</strong>`
    })
}
function deleteEntityDetail(DUID) {
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($(".dk-popup"))
    $.ajax({
        type: "DELETE",
        url: "/Farms/Properties/Entities/Details/" + DUID,
        success: function (result) {
            if (result) {
                $(`[data-entity-detail-id="${DUID}"]`).remove()
                dkPopupElDeleteEntityDetail.closeDkPop();
                removeLoading()
            } else {
                alert("EntityDetail could not be deleted #1")
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        }
    })
}
/* Delete Entity Detail END */
/* Complete Remainder */
function completeRemainder(DUID) {
    $.ajax({
        type: "POST",
        url: "/Farms/Properties/Entities/Details/",
        data: {
            "DUID": DUID,
            "remainderCompletedFlag": true
        },
        success: function (detail) {
            if (detail) {
                $(`[data-entity-detail-id = "${DUID}"] .fa-check-circle`).remove()
                $(`[data-entity-detail-id = "${DUID}"] .fa-clock`).removeClass('clr-primary')
                $(`[data-entity-detail-id = "${DUID}"] .fa-clock`).addClass('clr-success')
            }
        }
    })
}
/* Complete Remainder END */
/* Entity CP Value Update */
function cpUpdateEvents() {
    $('[data-cp-id]').change((e) => {
        var EUID = window.location.href.toString().split("/").pop()
        var val = $(e.target).val()
        var cpId = $(e.target).attr("data-cp-id")
        if (val == "on") {
            if (!$(e.target).is(':checked')) {
                val = "off"
            }
        }
        $.ajax({
            type: "POST",
            url: "/Farms/Properties/Entities/COPValues/",
            data: {
                "PUID": cpId,
                "EUID": EUID,
                "value": val
            },
            success: function (value) {
                if (value) {
                    console.log(value)
                    $.bootstrapGrowl("Entity updated.", {
                        offset: { from: 'bottom', amount: 20 },
                        align: 'left'
                    });
                }
            }
        })
    })
}
/* Entity CP Value Update END */