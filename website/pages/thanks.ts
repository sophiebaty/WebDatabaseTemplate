import { send } from "clientUtilities";
import { get } from "componentUtilities";

// Get the image element
let gif = document.getElementById("celebrationGif") as HTMLImageElement;

// Check if dark mode is enabled
if (localStorage.getItem("darkMode") == "true") {

    // Enable dark mode
    document.body.classList.add("dark-mode");

    // Use the dark mode GIF
    gif.src = "https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif";
}
else {

    // Use the light mode GIF
    gif.src = "https://i.pinimg.com/originals/d3/c6/8a/d3c68aeb6f9ead3e57f80f12d12304b8.gif";
}

