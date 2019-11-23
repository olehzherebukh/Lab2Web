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
    if (useLocalStorage == true) {
        data_context.get_lists(function (result) {
            listsArr = result;
            console.log(listsArr);
        });
        let len = listsArr.length;
        let myKey = 'news_info' + len;

        data_context.add_object(myKey, info_array);
        addElementToPage(myKey);
    } else {
        let myKey = "key";
        data_context.add_object(myKey, info_array);
        addElementToPage(myKey);
    }
    removeContent();
}

function addElementToPage(i) {
    if (useLocalStorage == true) {
        let info_obj = localStorage.getItem(i);
        let info_array = JSON.parse(info_obj);
        let result = [];

        for (let n in info_array)
            result.push([info_array [n]]);
        addSingleElement(result[0], result[1], result[2]);
    } else {
        data_context.get_lists(function (result) {
            listsArr = result;
            addSingleElement(result[0], result[1], result[2]);
        });
    }
}

function addSingleElement(title, body, img) {

    let title_k = document.createElement("h3");
    let title_r = document.createTextNode(title);
    title_k.appendChild(title_r);

    let body_input = document.createElement("p");
    let body_r = document.createTextNode(body);
    body_input.appendChild(body_r);

    let my_img = document.createElement("img");
    my_img.setAttribute("src", "data:image/png;base64, "+ img);
    my_img.setAttribute("alt", "News Image");

    let element = document.querySelector(".additional-news");
    let col_md_first = document.createElement("div");
    col_md_first.setAttribute("class", "col-md-4 single-news");
    let col_md_second = document.createElement("div");
    col_md_second.setAttribute("class", "col-md-4 single-news");
    let col_md_third = document.createElement("div");
    col_md_third.setAttribute("class", "col-md-4 single-news");
    col_md_first.appendChild(my_img);
    col_md_first.appendChild(title_k);
    col_md_first.appendChild(body_input);
    element.appendChild(col_md_first);
}

function sendToServer() {

}

document.addEventListener("DOMContentLoaded", openIndexedDB, false);

window.addEventListener('offline', function (event) {
    data_context.get_lists(function (result) {
        listsArr = result;
        if (listsArr != undefined) {
            let len = listsArr.length;

            for (let i = 0; i < len; i++) {
                let info_obj = localStorage.getItem('news_info' + i);
                let info_array = JSON.parse(info_obj);

                let result = [];

                for (let i in info_array)
                    result.push([info_array [i]]);
            }
        }

    });
    //sendToServer();
});

let db;

function openIndexedDB(){

    var openRequest = indexedDB.open('newsDatabase', 4);

    openRequest.onupgradeneeded = function(event) {
        console.log("Upgrading...");
        var db = event.target.result;
        db.createObjectStore("news_info");
    }

    openRequest.onsuccess = function(event) {
        console.log("Success!");
        db = event.target.result;
        init();
    }

    openRequest.onerror = function(event) {
        console.log("Error");
    }

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
                    addElementToPage('news_info' + i);
                }
            } else {
                addElementToPage(len);
            }

        }

    });
}

var useLocalStorage = false;

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
    var transaction = db.transaction(["news_info"], "readwrite");

    transaction.oncomplete = function (event) {
        console.log("Transaction complete");
    };

    transaction.onerror = function (event) {
        console.log("Error");
    };

    var objectStore = transaction.objectStore("news_info");
    var objectStoreRequest = objectStore.add(info_array, "news_info");

    objectStoreRequest.onsuccess = function (event) {
        console.log("Added to object store");
    };
};

IndexedDBDataProvider.prototype.get_lists = function (callback) {
    var transaction = db.transaction(["news_info"], "readwrite");

    transaction.oncomplete = function (event) {
        console.log("Transaction complete");
    };

    transaction.onerror = function (event) {
        console.log("Error");
    };

    var objectStore = transaction.objectStore("news_info");

    // Make a request to get a record by key from the object store
    var objectStoreRequest = objectStore.get("news_info");

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
