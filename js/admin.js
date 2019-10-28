if (document.getElementById("myImg") != null) {
    document.getElementById("myImg").remove();
}
$(":file").change(function () {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        if (document.getElementById("myImg") != null) {
            document.getElementById("myImg").remove();
        }
        let new_image = document.createElement("img");
        new_image.setAttribute("id", "myImg");
        new_image.setAttribute("src", "#");
        new_image.setAttribute("height", "50%");
        new_image.setAttribute("width", "50%");
        let addimg = document.getElementById("add-image");
        if (document.getElementById("old-image") != null) {
            document.getElementById("old-image").remove();
        }
        addimg.appendChild(new_image);
        reader.onload = imageIsLoaded;
        reader.readAsDataURL(this.files[0]);
    }


    document.getElementById("myImg").value = "set";

});

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function imageIsLoaded(e) {
    $('#myImg').attr('src', e.target.result);
    $('#yourImage').attr('src', e.target.result);
}

function checking() {
    if (document.getElementById("myImg") != null) {
        if (document.getElementById("myImg").value === undefined) {
            alert("Ви не додали зображення!");
            return;
        }
    }

    if (document.getElementById("myImg") === null) {
        alert("Ви не додали зображення!");
        return;
    }


    if (document.getElementById("title-input").value === "") {
        alert("Ви не написали заголовок!");
        return;
    }

    if (document.getElementById("body-input").value === "") {
        alert("Ви не написали опис новини!");
        return;
    }

    alert("Вашу новину додано!");
    return true;
}

function removeContent() {
    if (document.getElementById("myImg") != null) {
        document.getElementById("myImg").remove();
    }

    let old_image = document.createElement("img");
    old_image.setAttribute("id", "old-image");
    old_image.setAttribute("src", "images/add_image.png");
    let addimg = document.getElementById("add-image");
    addimg.appendChild(old_image);

    document.getElementById("title-input").value = "";
    document.getElementById("body-input").value = "";
}

function isOnline() {
    return window.navigator.onLine;
}

function localSt() {
    if (!checking()) {
        alert("Ви не заповнили всі поля!");
        return;
    } else {
        if (isOnline()) {
            sendToServer();
            removeContent();
        } else {
            addToLocalStorage();
        }
    }
}

function addToLocalStorage() {
    let title_input = document.getElementById("title-input").value;
    let body_input = document.getElementById("body-input").value;
    let bannerImage = document.getElementById('myImg');
    let imgData = getBase64Image(bannerImage);
    let info_array = [title_input, body_input, imgData];
    localStorage.setItem('news_info', JSON.stringify(info_array));
    removeContent();
}

function pageLoad() {
    if (isOnline()) {
        if (localStorage["news_info"]) {
            addElementToPage();
        }
    }
}

function addElementToPage() {
    let info_obj = localStorage.getItem('news_info');
    let info_array = JSON.parse(info_obj);

    let result = [];

    for (let i in info_array)
        result.push([info_array [i]]);

    let div_row1 = document.createElement("div");
    div_row1.setAttribute("class", "row");
    let container = document.createElement("div");
    container.setAttribute("class", "container");
    let div_row2 = document.createElement("div");
    div_row2.setAttribute("class", "row news-container");
    let col_md_first = document.createElement("div");
    col_md_first.setAttribute("class", "col-md-4 single-news");
    let col_md_second = document.createElement("div");
    col_md_second.setAttribute("class", "col-md-4 single-news");
    let col_md_third = document.createElement("div");
    col_md_third.setAttribute("class", "col-md-4 single-news");

    let title = document.createElement("h3");
    let title_r = document.createTextNode(result[0]);
    title.appendChild(title_r);

    let body_input = document.createElement("p");
    let body_r = document.createTextNode(result[1]);
    body_input.appendChild(body_r);

    let my_img = document.createElement("img");
    my_img.setAttribute("src", "data:image/png;base64, "+ result[2]);
    my_img.setAttribute("alt", "News Image");

    col_md_first.appendChild(my_img);
    col_md_first.appendChild(title);
    col_md_first.appendChild(body_input);
    div_row2.appendChild(col_md_first);
    div_row2.appendChild(col_md_second);
    div_row2.appendChild(col_md_third);
    container.appendChild(div_row2);
    div_row1.appendChild(container);
    let news_novy = document.getElementById("news-list");
    news_novy.appendChild(div_row1);
    localStorage.clear();
}

function sendToServer() {

}

window.addEventListener('offline', function(event){
    let info_obj = localStorage.getItem('news_info');
    let info_array = JSON.parse(info_obj);

    let result = [];

    for (let i in info_array)
        result.push([info_array [i]]);

    //sendToServer();
});
