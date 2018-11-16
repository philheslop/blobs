var BstrapModal = function (title, body, buttons) {
    var title = title || "Lorem Ipsum History",
    body = body || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    buttons = buttons || [{ Value: "CLOSE", Css: "btn-primary", Callback: function (event) { BstrapModal.Close(); } }];

    var GetModalStructure = function () {
        var that = this;
        that.Id = BstrapModal.Id = Math.random();
        var buttonshtml = "";
        for (var i = 0; i < buttons.length; i++) {
            buttonshtml += "<button type='button' class='btn " + 
            (buttons[i].Css||"") + "' name='btn" + that.Id + 
            "'>" + (buttons[i].Value||"CLOSE") + 
            "</button>";
        }
        return "<div class='modal fade' name='dynamiccustommodal' id='"
            + that.Id
            + "' tabindex='1' role='dialog' data-backdrop='static' data-keyboard='false' aria-labelledby='"
            + that.Id
            + "Label'><div class='modal-dialog'> <div class='modal-content'><div class='modal-header'> <button type='button' class='close modal-white-close' onclick='BstrapModal.Close()'><span aria-hidden='true'>&times; </span></button><h4 class='modal-title'>"
            + title
            + "</h4></div><div class='modal-body'> <div class='row'><div class='col-xs-12 col-md-12 col-sm-12 col-lg-12'>"
            + body
            + "</div></div></div><div class='modal-footer bg-default'> <div class='col-xs-12 col-sm-12 col-lg-12'>"
            + buttonshtml
            + "</div></div></div></div></div>";
}();
    BstrapModal.Delete = function () {
        var modals = document.getElementsByName("dynamiccustommodal");
        if (modals.length > 0) document.body.removeChild(modals[0]);
    };
    BstrapModal.Close = function () {
        $(document.getElementById(BstrapModal.Id)).modal('hide');
        BstrapModal.Delete();
    };    
    this.Show = function () {
        BstrapModal.Delete();
        document.body.appendChild($(GetModalStructure)[0]);
        var temp = $(GetModalStructure)[0];
        console.log(temp);
        //$(GetModalStructure)[0].appendTo("body");
        var btns = document.querySelectorAll("button[name='btn" + BstrapModal.Id + "']");
        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", buttons[i].Callback || BstrapModal.Close);
        }
        $(document.getElementById(BstrapModal.Id)).modal('show');
    };
};

function showModal() {
    new BstrapModal().Show();
}

function showBlobModal(blob) {
    new BstrapModal(blob.label,blob.history).Show();
}