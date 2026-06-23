
import { send } from "clientUtilities";
import { create, get } from "componentUtilities";

// Gets the dark mode checkbox from the page
let darkModeCheckbox = get("input", "darkModeCheckbox");

// Runs this function whenever the checkbox is checked or unchecked
darkModeCheckbox.onchange = function () {

    // Saves the current state of the checkbox ("true" or "false")
    // in the browser's localStorage so it is remembered
    localStorage.setItem(
        "darkMode",
        darkModeCheckbox.checked.toString()
    );

    // Reloads the page so the new theme is applied immediately
    location.reload();
};

// Checks if dark mode was previously saved as enabled
if (localStorage.getItem("darkMode") == "true") {

    // Adds the "dark-mode" CSS class to the page
    document.body.classList.add("dark-mode");

    // Updates the checkbox so it appears checked
    darkModeCheckbox.checked = true;
}