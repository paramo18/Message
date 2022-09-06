class Message extends FlashModal {

    constructor() {
        super();
        this.classModal = "message";
        this.position = "top-right";
        this.animation = "zoom"
        this.size = "s";
        this.time = 0;                 
        this.buttonClose = createSVGMessage("close");
        this.modal = false;
        this.header = null;  
        this.buttons = [];
    }

    success(description,title){
        return this.load("success",description,title);
    }

    info(description,title){
        return this.load("info",description,title);
    }

    error(description,title){
        return this.load("error",description,title);
    }

    warning(description,title){
        return this.load("warning",description,title);
    }

    confirm(description,title){
        return this.load("confirm",description,title);
    }

    load(type, description, title) {
        this.type = type;
        this.description = description;
        this.title = title;
        return this;
    }

    addButton(value,metod,time){
        this.position = "center";
        this.animation = "zoom"
        this.size = "m";
        this.modal = true;          
        this.buttonClose = null; 
        this.buttons.push({value:value,metod:metod,time:time});
        return this;
    }

    setDetail(detail) {
        this.detail = detail;
        return this;
    }
    
    setTitle(title){
        this.title = title;
        return this;
    }   

    show(){        
        this.id = this.position; 
        if (this.title != undefined){
            this.header = getHeaderMessage(this);  
        }
        this.body = getBodyMessage(this);
        this.footer = getFooterMessage(this);        
        super.show();             
    }
    
}

function getHeaderMessage(modal) {

    var label = document.createElement("label");    
    label.textContent = modal.title;
    label.classList.add("message-title");
    return label.outerHTML;

}

function getBodyMessage(modal) {

    var div = document.createElement("div");
    div.classList.add("message-body");
    var p = document.createElement("p");
    p.innerHTML = modal.description;
    div.appendChild(p);

    var fragment = new DocumentFragment();
    fragment.appendChild(createSVGMessage(modal.type));
    fragment.appendChild(div);
    return fragment;

}

function getFooterMessage(modal) {


    var fragment = new DocumentFragment();

    var divConfirm = document.createElement("div");
    divConfirm.classList.add("message-confirm-footer");

    modal.buttons.forEach(function(e){
        var button = document.createElement("button");
        button.classList.add("flashModal-button","message-" + modal.type);
        button.textContent = e.value;        
        button.addEventListener("click", function () {
            closeModal(this.closest(".flashModal-content"), modal);
            if (e.metod != undefined){
                e.metod();    
            }               
        });
        divConfirm.appendChild(button);         
    });

    fragment.appendChild(divConfirm);    

    if (modal.detail != undefined){

        var label = document.createElement("label");
        label.classList.add("message-label");
        label.textContent = "Mostrar detalle";
        label.addEventListener("click", function () {
            eventShowDetail(this, this.closest(".flashModal-content"), modal);
        });

        var divIcons = document.createElement("div");
        divIcons.classList.add("message-icons-detail", "flashModal-hide");
        divIcons.appendChild(createSVGMessage("look",modal));
        divIcons.appendChild(createSVGMessage("clipboard",modal));
        divIcons.appendChild(createSVGMessage("check",modal));

        var div = document.createElement("div");
        div.classList.add("message-footer");
        div.appendChild(createSVGMessage("chevronRight",modal));
        div.appendChild(createSVGMessage("chevronDown",modal));
        div.appendChild(label);
        div.appendChild(divIcons);

        var detail = document.createElement("div");  
        detail.classList.add("message-detail", "flashModal-hide");
        detail.innerHTML = getMessageDetail(modal);

        fragment.appendChild(div);
        fragment.appendChild(detail);

    }

    return fragment;

  
}

function getMessageDetail(modal){
    return createElement("textarea",[{class:"message-textarea message-detail-open"},{disabled:true},{textContent:modal.detail}]).outerHTML;
}

function eventShowDetail(e, content, modal) {

    var detail = content.querySelector(".message-detail");

    if (detail.classList.contains("flashModal-hide")) {

        detail.querySelector(".message-textarea").classList.replace("message-detail-close", "message-detail-open");
        detail.classList.replace("flashModal-hide", "flashModal-show");
        e.parentNode.querySelector(".message-icon-chevronRight").parentNode.classList.replace("flashModal-show", "flashModal-hide");
        e.parentNode.querySelector(".message-icon-chevronDown").parentNode.classList.replace("flashModal-hide", "flashModal-show");
        e.textContent = "Ocultar detalle";
        content.querySelector(".message-icons-detail").classList.replace("flashModal-hide", "flashModal-show");

    } else {

        e.parentNode.querySelector(".message-icon-chevronDown").parentNode.classList.replace("flashModal-show", "flashModal-hide");
        e.parentNode.querySelector(".message-icon-chevronRight").parentNode.classList.replace("flashModal-hide", "flashModal-show");
        e.textContent = "Mostrar detalle";
        detail.querySelector(".message-textarea").classList.replace("message-detail-open", "message-detail-close");
        setTimeout(function () {
            detail.classList.replace("flashModal-show", "flashModal-hide");
            content.querySelector(".message-icons-detail").classList.replace("flashModal-show", "flashModal-hide");
        }, 380);

    }

    setTimeout(function () {
        loadScrollModal(modal);
    }, 380);

}

function eventCopyDetail(e, content) {

    var textarea = content.querySelector(".message-textarea");
    textarea.disabled = false;
    textarea.select();
    document.execCommand("copy");
    textarea.disabled = true;
    textarea.focus();
    e.classList.add("flashModal-hide");
    content.querySelector(".message-icon-check").parentNode.classList.remove("flashModal-hide");

    setTimeout(function () {
        content.querySelector(".message-icon-check").parentNode.classList.add("flashModal-hide");
        content.querySelector(".message-icon-clipboard").parentNode.classList.remove("flashModal-hide");
    }, 3000);

}

function eventShowDetailAll(modal){

    var header = document.createElement("label");
    header.textContent = "Detalles";

    var body = document.createElement("textarea");
    body.classList.add("message-textarea");
    body.disabled = true;
    body.textContent = modal.detail;

    var footer = document.createElement("div");
    footer.classList.add("message-icons-detail");
    footer.appendChild(createSVGMessage("clipboard",modal));
    footer.appendChild(createSVGMessage("check",modal));

    new FlashModal("idDetalle", header.outerHTML, body, footer)
                  .setPosition("center")
                  .setSize("l")
                  .setClassModal("message")
                  .setType(modal.type)
                  .setButtonClose(createSVGMessage("close"))
                  .show();
    
}


function createSVGMessage(icon,modal){

    var svg = document.createElement("svg");
    svg.classList.add("message-icon-" + icon);
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("viewBox", "0 0 16 16");
    var path1 = document.createElement("path");
    var path2 = document.createElement("path");

    switch (icon) {
        case "success":
            path1.setAttribute("d", "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z");
            svg.appendChild(path1);
            svg = createElement("span",[{class:"message-icon"},{innerHTML:svg.outerHTML}]);
            break;
        case "warning":
            path1.setAttribute("d", "M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z");
            svg.appendChild(path1);
            svg = createElement("span",[{class:"message-icon"},{innerHTML:svg.outerHTML}]);
            break;
        case "error":
            path1.setAttribute("d", "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z");
            svg.appendChild(path1);
            svg = createElement("span",[{class:"message-icon"},{innerHTML:svg.outerHTML}]);
            break;
        case "info":
            path1.setAttribute("d", "M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z");
            svg.appendChild(path1);
            svg = createElement("span",[{class:"message-icon"},{innerHTML:svg.outerHTML}]);
            break;
        case "confirm":
            path1.setAttribute("d", "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z");
            svg.appendChild(path1);
            svg = createElement("span",[{class:"message-icon"},{innerHTML:svg.outerHTML}]);
            break;
        case "chevronRight":
            path1.setAttribute("d", "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z");
            svg.appendChild(path1);
            svg = createElement("span",[{innerHTML:svg.outerHTML}]);
            svg.classList.add("flashModal-show");
            svg.addEventListener("click", function () {
                eventShowDetail(this.parentNode.querySelector("label"), this.closest(".flashModal-content"), modal);
            });
            break;
        case "chevronDown":
            path1.setAttribute("fill-rule","evenodd")
            path1.setAttribute("d", "M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z");
            svg.appendChild(path1);
            svg = createElement("span",[{innerHTML:svg.outerHTML}]);
            svg.classList.add("flashModal-hide");
            svg.addEventListener("click", function () {
                eventShowDetail(this.parentNode.querySelector("label"), this.closest(".flashModal-content"), modal);
            });
            break;
        case "clipboard":
            path1.setAttribute("d","M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z")
            svg.appendChild(path1);
            path2.setAttribute("d", "M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z");
            svg.appendChild(path2);
            svg = createElement("span",[{title:"Copiar detalle"},{innerHTML:svg.outerHTML}]);
            svg.addEventListener("click", function () {
                eventCopyDetail(this, this.closest(".flashModal-content"));
            });
            break;
        case "check":
            path1.setAttribute("d", "M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z");
            svg.appendChild(path1);
            svg = createElement("span",[{title:"Copiado!"},{innerHTML:svg.outerHTML}]);
            svg.classList.add("flashModal-hide");
            break;
        case "look":
            path1.setAttribute("d","M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z")
            svg.appendChild(path1);
            svg = createElement("span",[{title:"Ampliar detalle"},{innerHTML:svg.outerHTML}]);
            svg.addEventListener("click", function () {
                eventShowDetailAll(modal);
            });
            break;
        case "close":
            path1.setAttribute("d", "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z")
            svg.appendChild(path1);
            svg = createElement("span",[{title:"Cerrar"},{innerHTML:svg.outerHTML}]);
            break;
        default:
            break;
    }

    return svg;
}