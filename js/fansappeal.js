function isOnline() {
    return window.navigator.onLine;
}

function localSt() {
    if ((document.getElementById("review-input").value).trim() === "") {
        alert("Ви не написали коментар!");
        removeText();
        return;
    } else {
        if (isOnline()) {
            sendToServer();
            removeText();
        } else {
            addToLocalStorage();
            removeText();
        }
    }
}

function addToLocalStorage() {
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes();
    let date = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
    let input = document.getElementById("review-input").value;
    let info_array = [time, date, input];

    localStorage.setItem('appeal_info', JSON.stringify(info_array));
}

function pageLoad() {
    if (isOnline()) {
        if (localStorage["appeal_info"]) {
            addElementToPage();
        }
    }
}

function addElementToPage() {
    let info_obj = localStorage.getItem('appeal_info');
    let info_array = JSON.parse(info_obj);

    let result = [];

    for (let i in info_array)
        result.push([info_array [i]]);

    let div_row1 = document.createElement("div");
    div_row1.setAttribute("class", "row");
    div_row1.setAttribute("id", "row-appeal");
    let container = document.createElement("div");
    container.setAttribute("class", "container");
    let div_row2 = document.createElement("div");
    div_row2.setAttribute("class", "row send-button-row");
    let col_md_first = document.createElement("div");
    col_md_first.setAttribute("class", "col-md-2 user-info");
    let col_md_second = document.createElement("div");
    col_md_second.setAttribute("class", "col-md-10");

    let paragraph_review = document.createElement("p");
    let paragraph_r = document.createTextNode(result[2]);
    paragraph_review.appendChild(paragraph_r);

    let paragraph_author = document.createElement("p");
    let paragraph_a = document.createTextNode("Maxym Marina");
    paragraph_author.appendChild(paragraph_a);

    let paragraph_time = document.createElement("p");
    let paragraph_t = document.createTextNode(result[0]);
    paragraph_time.appendChild(paragraph_t);

    let paragraph_date = document.createElement("p");
    let paragraph_d = document.createTextNode(result[1]);
    paragraph_date.appendChild(paragraph_d);

    col_md_first.appendChild(paragraph_author);
    col_md_first.appendChild(paragraph_time);
    col_md_first.appendChild(paragraph_date);
    col_md_second.appendChild(paragraph_review);
    div_row2.appendChild(col_md_first);
    div_row2.appendChild(col_md_second);
    container.appendChild(div_row2);
    div_row1.appendChild(container);
    let new_appeal = document.getElementById("fans-appeal");
    new_appeal.appendChild(div_row1);
    localStorage.clear();
}

function removeText() {
    document.getElementById("review-input").value = "";
}

function sendToServer() {

}

window.addEventListener('offline', function(event){
    let info_obj = localStorage.getItem('appeal_info');
    let info_array = JSON.parse(info_obj);

    let result = [];

    for (let i in info_array)
        result.push([info_array [i]]);

    //sendToServer();
});