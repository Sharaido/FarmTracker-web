function upgradeMembershipPopup(UUID) {
    var body = `
    <div class="container">
        <div id="changeMemberTypeWarn"></div>
        <form id="changeMemberTypeForm" method="POST">
            <div class="member-types-container">
                <label class="dark">
                    <div class="title">FARMER</div>
                    <div>1 FARM</div>
                    <div>3 USERS</div>
                    <div>1 AD PER MONTH</div>
                    <div>NO SUPPORT</div>
                    <input type="radio" name="MTUID" value="2"/>
                </label>
                <label>
                    <div class="title">BUSSINES</div>
                    <div>1 FARM</div>
                    <div>3 USERS</div>
                    <div>1 AD PER MONTH</div>
                    <div>NO SUPPORT</div>
                    <input type="radio" name="MTUID" value="4"/>
                </label>
                <label class="dark">
                    <div class="title">PROFESSIONAL</div>
                    <div>1 FARM</div>
                    <div>3 USERS</div>
                    <div>1 AD PER MONTH</div>
                    <div>NO SUPPORT</div>
                    <input type="radio" name="MTUID" value="5"/>
                </label>
                <label>
                    <div class="title">ADVENCED</div>
                    <div>1 FARM</div>
                    <div>3 USERS</div>
                    <div>1 AD PER MONTH</div>
                    <div>NO SUPPORT</div>
                    <input type="radio" name="MTUID" value="3"/>
                </label>
            </div>
            <input type="hidden" id="UUID" name="UUID" value="${UUID}">
        </form>
    </div>`

    dkPopupElUpgradeMembership = dkPopup({
        title: 'Select Membership',
        type: 'confirm',
        confirmClick: function () {
            submitchangeMemberTypeForm()
        },
        content: body
    })
}

function submitchangeMemberTypeForm() {
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    showLoading($(".dk-popup"))
    $.ajax({
        type: "PUT",
        url: "/Members/MemberType",
        data: $('#changeMemberTypeForm').serialize(),
        success: function (result) {
            if (result) {
                $('#changeMemberTypeWarn').html(`<div class="alert alert-success" role="alert">Membership is changed successfully!</div>`)
                var membership = $('#changeMemberTypeForm input:checked').parent().find('.title').text()
                $('#memberType').html(membership)
                setTimeout(dkPopupElUpgradeMembership.closeDkPop, 2000)
                removeLoading()
            } else {
                $('#changeMemberTypeWarn').html(`<div class="alert alert-danger" role="alert">Membership could not be changed!</div>`)
                confirmBtn.removeAttr('disabled').removeClass('disabled')
                removeLoading()
            }
        }
    })
}