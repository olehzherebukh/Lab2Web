document.addEventListener("DOMContentLoaded", openIndexedDB, false);

const DOMAIN = 'http://localhost:3000/';

window.addEventListener('online', function (event) {
    data_context.get_lists(function (result) {
        listsArr = result;
        console.log(listsArr);

        if (listsArr != undefined) {
            if (useLocalStorage == true) {
                let len = listsArr.length;
                for (let i = 0; i < len; i++) {
                    let info_obj = localStorage.getItem('appeal_info' + i);
                    let info_array = JSON.parse(info_obj);

                    let result = [];

                    for (let i in info_array)
                        result.push(info_array [i]);
                    let fansAppeal = new FansAppeal(result[2], result[0], result[1]);
                    sendToServer('fansappeal', fansAppeal);
                    addSingleElement2(fansAppeal);
                }
                localStorage.clear();
            } else {
                let fansAppeal = new FansAppeal(result[2], result[0], result[1]);
                sendToServer('fansappeal', fansAppeal);
                addSingleElement2(fansAppeal);
            }
        }

    });
});

let db;

function openIndexedDB() {

    var openRequest = indexedDB.open('bandDatabase', 4);

    openRequest.onupgradeneeded = function (event) {
        console.log("Upgrading...");
        let db = event.target.result;
        db.createObjectStore("appeal_info");
    }

    openRequest.onsuccess = function (event) {
        console.log("Success!");
        db = event.target.result;
        init();
    }

    openRequest.onerror = function (event) {
        console.log("Error");
    }

}

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
            sendToServer('fansappeal', readInfo());
            addSingleElement2(readInfo());
            removeText();
        } else {
            addToLocalStorage();
            removeText();
        }
    }
}

function readInfo() {
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes();
    let date = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
    let input = document.getElementById("review-input").value;
    let fansAppeal = new FansAppeal(input, date, time);
    return fansAppeal;
}

function addToLocalStorage() {
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes();
    let date = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
    let input = document.getElementById("review-input").value;
    let info_array = [time, date, input];
    let fansAppeal = new FansAppeal(input, date, time);
    if (useLocalStorage == true) {
        data_context.get_lists(function (result) {
            listsArr = result;
            console.log(listsArr);
        });
        let len = listsArr.length;
        let myKey = 'appeal_info' + len;

        data_context.add_object(myKey, info_array);
    } else {
        let myKey = "key";
        data_context.add_object(myKey, info_array);
    }
}

function pageLoad() {
    getFromServer('fansappeal',
        appeals => appeals.map(addSingleElement2));
}

function addElementToPage(i) {
    if (useLocalStorage == true) {
        let info_obj = localStorage.getItem(i);
        let info_array = JSON.parse(info_obj);
        let result = [];

        for (let n in info_array)
            result.push([info_array [n]]);
        addSingleElement(result[2], result[0], result[1]);
    } else {
        data_context.get_lists(function (result) {
            listsArr = result;
            addSingleElement(result[2], result[0], result[1]);
        });
    }
}

function addSingleElement2(appeal) {
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
    let paragraph_r = document.createTextNode(appeal.body);
    paragraph_review.appendChild(paragraph_r);

    let paragraph_author = document.createElement("p");
    let paragraph_a = document.createTextNode("Maxym Marina");
    paragraph_author.appendChild(paragraph_a);

    let paragraph_time = document.createElement("p");
    let paragraph_t = document.createTextNode(appeal.time);
    paragraph_time.appendChild(paragraph_t);

    let paragraph_date = document.createElement("p");
    let paragraph_d = document.createTextNode(appeal.date);
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
}

function removeText() {
    document.getElementById("review-input").value = "";
}


function sendToServer(key, data, del = true) {
    if (data.body) {
        let req = new XMLHttpRequest();
        req.open("POST", DOMAIN + key, true);
        req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        req.onreadystatechange = console.log;
        req.send(JSON.stringify(data));
    }
    if (!del) return;
}

function getFromServer(key, callback) {
    let req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', DOMAIN + key, true);
    req.onload = () => req.status === 200 ? callback(req.response) : console.log(req.response);
    req.send(null);
}

var listsArr = [];

function init() {
    data_context.get_lists(function (result) {
        listsArr = result;
        if (listsArr != undefined) {
            let len = listsArr.length;
            console.log(listsArr);
            if (useLocalStorage == true) {
                for (let i = 0; i < len; i++) {
                    addElementToPage('appeal_info' + i);
                }
            } else {
                addElementToPage(len);
            }

        }

    });
}

var useLocalStorage = true;

var LocalStorageDataProvider = function () {
};

LocalStorageDataProvider.prototype.add_object = function (key, value) {
    localStorage[key] = JSON.stringify(value);
};

LocalStorageDataProvider.prototype.get_lists = function (callback) {
    var arr = [],
        i;

    for (i = 0; i < localStorage.length; i++) {
        var listItem = localStorage.key(i);
        if (listItem) {
            arr.push(listItem);
        }
    }
    callback(arr);
};

var IndexedDBDataProvider = function () {
};


IndexedDBDataProvider.prototype.add_object = function (myKey, info_array) {
    var transaction = db.transaction(["appeal_info"], "readwrite");

    transaction.oncomplete = function (event) {
        console.log("Transaction complete");
    };

    transaction.onerror = function (event) {
        console.log("Error");
    };

    var objectStore = transaction.objectStore("appeal_info");
    var objectStoreRequest = objectStore.add(info_array, "appeal_info");

    objectStoreRequest.onsuccess = function (event) {
        console.log("Added to object store");
    };
};

IndexedDBDataProvider.prototype.get_lists = function (callback) {
    var transaction = db.transaction(["appeal_info"], "readwrite");

    transaction.oncomplete = function (event) {
        console.log("Transaction complete");
    };

    transaction.onerror = function (event) {
        console.log("Error");
    };

    var objectStore = transaction.objectStore("appeal_info");

    // Make a request to get a record by key from the object store
    var objectStoreRequest = objectStore.get("appeal_info");

    objectStoreRequest.onsuccess = function (event) {
        console.log("Got!");
        var myRecord = objectStoreRequest.result;
        console.log(myRecord);
        callback(myRecord);
    };

};

var DAL = function () {
    //var useLocalStorage = false;
    !window.indexedDB;
    if (useLocalStorage) {
        this.data_provider = new LocalStorageDataProvider();
    } else {
        this.data_provider = new IndexedDBDataProvider();
    }
};

DAL.prototype.add_object = function (myKey, info_array) {
    this.data_provider.add_object(myKey, info_array);
};
DAL.prototype.get_lists = function (callback) {
    return this.data_provider.get_lists(callback);
};

let data_context = new DAL();

class FansAppeal {
    constructor(body, date, time) {
        this.body = body || '';
        this.date = date || '';
        this.time = time || '';
    }
}