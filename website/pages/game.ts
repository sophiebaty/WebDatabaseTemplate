import { send } from "clientUtilities";
import { get } from "componentUtilities";

// Checks if dark mode was previously enabled
if (localStorage.getItem("darkMode") == "true") {

    // Adds the dark mode class to the page
    document.body.classList.add("dark-mode");
}

// Stores all questions received from the server
let questions: any[] = [];

// Keeps track of the current question number
let index = 0;

// Remembers whether the player has already voted on this question
let voted = false;

// Gets the menu button and returns to the main menu when clicked
var gamemenuButton = get("button", "game-menuButton");
gamemenuButton.onclick = function () {
    location.href = "index.html";
};

// Gets the Next button and connects it to the nextQuestion function
var nextButton = get("button", "nextButton");
nextButton.onclick = nextQuestion;

// Gets the two answer buttons
var optionAButton = get("button", "optionAButton");
var optionBButton = get("button", "optionBButton");

// When Option A is clicked, vote for A
optionAButton.onclick = function () {
    vote("A");
};

// When Option B is clicked, vote for B
optionBButton.onclick = function () {
    vote("B");
};

// Loads the questions from the server
async function start() {

    // Waits until the server returns all questions
    questions = await send("getQuestions", []);

    // Displays the first question
    showQuestion();
}

// Starts the game
start();

// Displays the current question and its answers
function showQuestion() {

    // Re-enable the answer buttons for a new question
    optionAButton.disabled = false;
    optionBButton.disabled = false;

    // Disable the Next button until the user votes
    nextButton.disabled = !voted;

    // Gets the current question
    let q = questions[index];

    // Displays the question text
    document.getElementById("questionBox")!.textContent = q.text;

    // Displays the two answer choices
    document.getElementById("optionAButton")!.textContent = q.optionA;
    document.getElementById("optionBButton")!.textContent = q.optionB;

    // If the user has already voted, show the percentages
    if (voted) {

        // Calculates the total number of votes
        let total = q.votesA + q.votesB;

        // Calculates the percentage for each option
        let percentA = Math.round((q.votesA / total) * 100);
        let percentB = Math.round((q.votesB / total) * 100);

        // Displays the percentages on the page
        document.getElementById("results")!.innerHTML = `
        <span>${percentA}%</span>
        <span>${percentB}%</span>
        `;
    }
}

// Handles a player's vote
function vote(option: string) {

    // Prevents voting more than once
    if (voted) {
        return;
    }

    // Gets the current question
    let q = questions[index];

    // Sends the vote to the server/database
    send("vote", [q.id, option]);

    // Increases the local vote count
    if (option == "A") {
        q.votesA++;
    }
    else {
        q.votesB++;
    }

    // Marks that the player has voted
    voted = true;

    // Disables both answer buttons so they can't vote again
    optionAButton.disabled = true;
    optionBButton.disabled = true;

    // Refreshes the display to show the percentages
    showQuestion();
}

// Moves to the next question
function nextQuestion() {

    // Prints the voted status to the console (used for debugging)
    console.log("voted =", voted);

    // Does nothing if the player hasn't voted yet
    if (!voted) {
        return;
    }

    // Moves to the next question
    index++;

    // If there are no more questions, go to the Thanks page
    if (index >= questions.length) {

        location.href = "thanks.html";

        return;
    }

    // Resets the voting status for the new question
    voted = false;

    // Clears the previous percentages
    document.getElementById("results")!.innerHTML = "";

    // Displays the next question
    showQuestion();
}

// Makes these functions available globally if needed
(window as any).vote = vote;
(window as any).nextQuestion = nextQuestion;