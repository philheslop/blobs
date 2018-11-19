var BstrapModal = function (title, body, buttons) {
    var title = title || "Lorem Ipsum History",
    body = body || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    buttons = buttons || [{ Value: "CLOSE", Css: "btn-primary", Callback: function (event) { BstrapModal.Close(); } }];

    if(currentBlob) {

        title += "&emsp;<button type='button' class='btn btn-primary' name='addChildBtn' onclick='currentBlobAddChild()'>+</button>"
        body = "<ul name='currentBlobChildList'></ul>"

        if(currentBlob.children && currentBlob.children.length > 0) {
            body = "<ul name='currentBlobChildList'>";
            for(var i = 0; i < currentBlob.children.length; ++ i) {
                var child = currentBlob.children[i];
                //var warning = "";
                //if(child.children && child.children.length > 0) warning = "!";
                body += "<li><span name='currentBlobChild'>"
                + child.name
                + "</span><span class='rightButtons'><button type='button' class='btn btn-secondary btn-sm' name='editBtn' onclick='changeCurrentBlobChild("+i+")'>Edit</button><button type='button' class='btn btn-secondary btn-sm' name='deleteBtn' onclick='deleteCurrentBlobChild("+i+")'>Delete</button></span><span class='clear'></span></li>";
                console.log(body);
            }
            body += "</ul>";
        }
    }

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
        update();
        currentBlob = null;
        BstrapModal.Delete();
    };    
    this.Show = function () {
        BstrapModal.Delete();
        document.body.appendChild($(GetModalStructure)[0]);
        var modalStructure = $(GetModalStructure)[0];
        console.log(modalStructure);
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
    var btns = document.querySelectorAll("button[name='btn" + BstrapModal.Id + "']");
}

function showBlobModal() {
    if(currentBlob)
        new BstrapModal(currentBlob.name,currentBlob.children).Show();
}

function changeCurrentBlobChild(index)
{
    console.log('changing current blob child: ' + index);
    console.log(currentBlob);
    if(currentBlob && currentBlob.children && currentBlob.children.length > index) {
        var newName = changeBlobName(currentBlob.children[index]);
        var listItems = document.getElementsByName('currentBlobChild');
        console.log(listItems);
        listItems[index].innerText = newName;
    }
}

function currentBlobAddChild() {
    if(currentBlob) {
        var i = 0;
        if(currentBlob.children) i = currentBlob.children.length;
        var child = addChild(currentBlob,"");
        var ul = document.getElementsByName('currentBlobChildList')[0];
        var li = document.createElement("li");
        li.innerHTML = "<span name='currentBlobChild'>"
        + child.name
        + "</span><span class='rightButtons'><button type='button' class='btn btn-secondary btn-sm' name='editBtn' onclick='changeCurrentBlobChild("+i+")'>Edit</button><button type='button' class='btn btn-secondary btn-sm' name='deleteBtn' onclick='deleteCurrentBlobChild("+i+")'>Delete</button></span><span class='clear'></span>"
        ul.appendChild(li);
        changeCurrentBlobChild(i);
    }
}

function deleteCurrentBlobChild(index) {
    console.log('deleting current blob child: ' + index);
    console.log(currentBlob);
    if(currentBlob && currentBlob.children && currentBlob.children.length > index) {
        var child = currentBlob.children[index];
        removeChild(currentBlob,child);
        var ul = document.getElementsByName('currentBlobChildList')[0];
        ul.removeChild(ul.children[index])
    } 
}