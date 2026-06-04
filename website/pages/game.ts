import { send } from "clientUtilities";
import { get } from "componentUtilities";

let questions: any[] = [];
let index = 0;
let voted = false;

var gamemenuButton = get("button", "game-menuButton")
gamemenuButton.onclick = function() { location.href="index.html"}

var nextButton = get("button", "nextButton");
nextButton.onclick = nextQuestion;


async function start() {

    questions = await send("getQuestions", []);

    showQuestion();
}

start();

function showQuestion() {

    let q = questions[index];

    let html = `
        <h2>${q.text}</h2>

        <button onclick="vote('A')">
            ${q.optionA}
        </button>

        <button onclick="vote('B')">
            ${q.optionB}
        </button>
    `;

    if (voted) {

        let total = q.votesA + q.votesB;

        let percentA = Math.round((q.votesA / total) * 100);

        let percentB = Math.round((q.votesB / total) * 100);

        html += `
            <br><br>
            <h3>
                ${percentA}% 
                
                ${percentB}% 
            </h3>
        `;
    }

    document.getElementById("questionBox")!.innerHTML = html;
}

function vote(option: string) {

    let q = questions[index];
    console.log(q);
    send("vote", [q.id, option]);

    if (option == "A") {
        q.votesA++;
    }
    else {
        q.votesB++;
    }

    voted = true;

    showQuestion();
}


function nextQuestion() {

    index++;

    if (index >= questions.length) {
        index = 0;
    }

    document.getElementById("results")!.innerHTML = "";

    showQuestion();
}

(window as any).vote = vote;
(window as any).nextQuestion = nextQuestion;