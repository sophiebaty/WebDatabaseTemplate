import { send } from "clientUtilities";
import { get } from "componentUtilities";

var saveButton = get("button", "saveButton")
var alertDiv= get("div", "alertDiv")
var addmenuButton =get("button", "add-menuButton")

saveButton.onclick = function addQuestion() {

    let q = (document.getElementById("q") as HTMLInputElement).value;

    let a = (document.getElementById("a") as HTMLInputElement).value;

    let b = (document.getElementById("b") as HTMLInputElement).value;

    if (q == "" || a == "" || b == "") {

       alertDiv.innerText = "fill out all of the inputs!"

        return;
    }
    else
    {
       alertDiv.innerText = ""
    }

    send("addQuestion", [q, a, b]);

    alert("Question Saved!");

    (document.getElementById("q") as HTMLInputElement).value = "";
    (document.getElementById("a") as HTMLInputElement).value = "";
    (document.getElementById("b") as HTMLInputElement).value = "";
}

addmenuButton.onclick = function() {
    location.href = "index.html";
}

