var allTrue = true;

var alertError = document.getElementById("error");

const chiave = 5;
const regNomeCognome = /[^0-9][a-zA-Z]/g;
const regEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const regPSW = /(.){6,}[A-Z]{0,1}[!#$%&'*+/=?^_`]{1,}/g;
const regUsername = /[a-zA-Z0-9_-]{5,32}/g;


function login() {

    /*
    CONTROLLO SE MAIL E PSW SONO SCRITTI GIUSTI
    */

    allTrue = true;

    let form = document.getElementById("loginForm");
    allInput = form.querySelectorAll("input");

    for (let i = 0; i < allInput.length; i++) {
        if (allInput[i].type == "email") {
            if (!regEmail.test(allInput[i].value)) {
                errore(document.getElementById(`error${allInput[i].id}`), allInput[i]);
                allTrue = false;
            }
        } else if (allInput[i].type == "password") {
            if (!regPSW.test(allInput[i].value)) {
                errore(document.getElementById(`error${allInput[i].id}`), allInput[i]);
                allTrue = false;
            }
        }
    }
    if (allTrue) loginPOST();
}



function validate() {

    allTrue = true;

    let form = document.getElementById("registerForm");
    allInput = form.querySelectorAll("input");

    for (let i = 0; i < allInput.length; i++) {

        switch (allInput[i].type) {
            case "text":
                if (allInput[i].name == "inputUsername") {
                    if (!regUsername.test(allInput[i].value)) {
                        errore(document.getElementById(`error${allInput[i].id}`), allInput[i]);
                        allTrue = false;
                    }
                } else {
                    if (!regNomeCognome.test(allInput[i].value)) {
                        errore(document.getElementById(`error${allInput[i].id}`), allInput[i]);
                        allTrue = false;
                    }
                }
                break;
            case "email":
                if (!regEmail.test(allInput[i].value)) {
                    errore(document.getElementById(`error${allInput[i].id}`), allInput[i]);
                    allTrue = false;
                }
                break;
            case "password":
                if (!regPSW.test(allInput[i].value)) {
                    errore(document.getElementById(`error${allInput[i].id}`), allInput[i]);
                    allTrue = false;
                }
                break;
            case "checkbox":
                if (!allInput[i].name == "remember_me") return;
        }
    }
    if (allTrue) sendPOST();
}

function errore(classeErrore, classeDiv) {

    classeErrore.classList.add("text-danger");
    classeErrore.classList.remove("d-none");

    classeDiv.value = "";
    classeDiv.classList.add("is-invalid");

    setTimeout(() => {
        classeErrore.classList.add("d-none")
        classeDiv.classList.remove("is-invalid");
    }, 2000);

}

async function loginPOST() {
    const req = new XMLHttpRequest();

    var form = document.querySelector("#loginForm");
    var data = new FormData(form);

    console.log(form.querySelectorAll("input"));
    req.onreadystatechange = function() {
        if (req.readyState == XMLHttpRequest.DONE) {

            console.log(req.response);

            switch (req.responseText.split(";")[0]) {
                case "0":
                    createTextElement("login_error_alert", "Nessun dato salvato nel database");
                    break;
                case "1":
                    createTextElement("login_error_alert", "Email non trovata");
                    break;
                case "2":
                    createTextElement("login_success_alert", "Login con successo");
                    console.log(req.responseText.split(";")[1])

                    si = JSON.parse(req.responseText.split(";")[1]);
                    console.log(si);

                    string = `${si.nome}%%${si.email}%%${si.username}`;
                    setCookie("credentials", string, 15);
                    setTimeout(() => {
                        console.log("done")
                        window.location.replace("http://localhost:8000/login_register/index.html");
                    }, 2500);
                    break;
                case "3":
                    createTextElement("login_error_alert", "Password errata")
                    break;
            }
        }
    }


    await req.open("POST", "login.php");
    await req.send(data);
}

async function sendPOST() {

    const req = new XMLHttpRequest();

    let psw = document.querySelector("#inputPassword");
    psw.value = encrypt(psw.value);

    var form = document.querySelector("#registerForm");

    var data = new FormData(form);

    req.onreadystatechange = function() {
        if (req.readyState == XMLHttpRequest.DONE) {

            if (req.responseText == "0") return createTextElement("login_alert", "Email già registrata");

            document.body.onload = createTextElement("registered_alert", "Correttamente registrato, benvenuto!");
            document.getElementById("registerForm").reset();
            setTimeout(() => {
                window.location.replace("http://localhost:8000/login_register/login.html");
            }, 2500);
        }
    }

    await req.open("POST", "register.php", true);
    await req.send(data);
}

function createTextElement(div, textElement) {

    var targetArea = document.getElementById(div);

    if (!targetArea.innerHTML) {
        var p = document.createElement("p");
        var snippet = document.createTextNode(textElement);
        p.appendChild(snippet);
        targetArea.appendChild(p);
    }

    targetArea.classList.remove("d-none");

    setTimeout(() => {
        targetArea.classList.add("d-none")
    }, 4000);
}

function showPassword() {

    var pswBox = document.getElementById("inputPassword");

    pswBox.type == "password" ? pswBox.type = "text" : pswBox.type = "password";

}

function encrypt(plaintext) {

    let alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+/=?^_`".split("");

    newText = new Array();

    //codifica di cesare
    res = plaintext.split("").reverse()
    let result = res.join("");

    return btoa(result)
}

function setCookie(cname, cvalue, cminutes) {
    const d = new Date();
    d.setTime(d.getTime() + (cminutes * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteAllCookies() {
    console.log("deleting all cookies!")
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    document.location.reload();
}


async function getAllInfo() {

    mail = document.getElementById("span_mail").innerHTML;
    console.log(mail)

    const req = new XMLHttpRequest();


    console.log("ciao")
    req.onreadystatechange = function() {
        if (this.status === 200) {


            res = this.responseText;

            if (res == 1) return console.log("C'è stato un errore");


            console.log(JSON.parse(res))




            data = JSON.parse(res);

            Object.keys(data).map((element, i) => {

                element = document.createElement("div");

                console.log(`${Object.keys(data)[i]}:${Object.entries(data)[i]}`)
                element_content = document.createTextNode(`${Object.keys(data)[i]}:${Object.entries(data)[i]}`);

                div = document.getElementById("info_container");

                element.appendChild(element_content);
                return document.body.insertBefore(element, div)
            })



        }
    }

    await req.open("POST", "fetch.php", true);
    await req.send(mail);
}