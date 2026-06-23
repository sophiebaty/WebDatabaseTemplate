import { send } from "clientUtilities";
import { get } from "componentUtilities";

// Checks if dark mode was previously enabled and applies it to the page
if (localStorage.getItem("darkMode") == "true") {

    document.body.classList.add("dark-mode"); // Adds the dark-mode CSS class to the body
}

// Gets references to HTML elements
var saveButton = get("button", "saveButton"); // The Save button
var alertDiv = get("div", "alertDiv"); // The div used to display error messages
var addmenuButton = get("button", "add-menuButton"); // The button that returns to the menu

// Runs this function when the Save button is clicked
saveButton.onclick = function addQuestion() {

    // Gets the text entered by the user in the three input boxes
    let q = (document.getElementById("q") as HTMLInputElement).value;
    let a = (document.getElementById("a") as HTMLInputElement).value;
    let b = (document.getElementById("b") as HTMLInputElement).value;

    // Checks if any of the inputs are empty
    if (q == "" || a == "" || b == "") {

        // Shows an error message if something is missing
        alertDiv.innerText = "fill out all of the inputs!";

        // Stops the function so the question is not saved
        return;
    }
    else {

        // Clears the error message if everything is filled in
        alertDiv.innerText = "";
    }

    // Sends the new question and its two answers to the server/database
    send("addQuestion", [q, a, b]);

    // Displays a confirmation message
    alert("Question Saved!");

    // Clears all input boxes so the user can add another question
    (document.getElementById("q") as HTMLInputElement).value = "";
    (document.getElementById("a") as HTMLInputElement).value = "";
    (document.getElementById("b") as HTMLInputElement).value = "";
}

// When the menu button is clicked, go back to the main menu page
addmenuButton.onclick = function() {
    location.href = "index.html";
}