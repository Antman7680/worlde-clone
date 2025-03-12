function waitForWordList(callback) {
    const checkWordList = setInterval(() => {
        if (window.wordList) {
            clearInterval(checkWordList); // Stop checking once loaded
            callback();
        } else {
            console.error("wordList is still not loaded...");
        }
    }, 100); // Check every 100ms
}

let gameOn = true;

const alphabetWord = "qwertyuiopasdfghjklzxcvbnm";
const letterList = alphabetWord.split('');
let lives = 6;
let currentGuess = 0;

let word;
let wordArray;
let guessArray = [];
let guessLetter = 0;

function chooseWord() {
    let num = Math.floor(Math.random() * wordList.length);
    word = wordList[num];
    wordArray = word.split('');
}

window.onload = function () {
    waitForWordList(() => {
        chooseWord();
        console.log("Selected word:", word);
        console.log("Word array:", wordArray);

        const body = document.getElementById("body");
        body.addEventListener("keyup", (e) => {
            const key = e.key.toLowerCase();
            const isLetter = isChar(key);
            guess(isLetter);
        });

        // Initialize the caret position
        updateCaret();
    });
};

function isChar(k) {
    k = k.toLowerCase();
    if (letterList.includes(k) || k === "backspace" || k === "enter") {
        return k;
    }
    return "";
}

function updateCaret() {
    if (!gameOn) return;

    // Remove old caret
    document.querySelectorAll('.caret').forEach(caret => caret.remove());

    const currentCell = document.getElementById(`${currentGuess}:${guessLetter}`);
    if (currentCell) {
        const caret = document.createElement("div");
        caret.classList.add("caret"); // Apply the CSS animation
        currentCell.appendChild(caret); // Append caret inside the current cell
    }
}

// Modify the guess function to include caret updates
function guess(input) {
    if (gameOn) {
        if (input === "backspace" && guessLetter > 0) {
            guessLetter--;
            document.getElementById(`${currentGuess}:${guessLetter}`).innerHTML = "";
            guessArray.pop();
        } else if (input === "enter" && guessLetter === 5) {
            wordCheck();
        } else if (input !== "enter" && input && guessLetter < 5 && input !== "backspace") {
            document.getElementById(`${currentGuess}:${guessLetter}`).innerHTML = input.toUpperCase();
            guessArray[guessLetter] = input;
            guessLetter++;
        }
        // Update the caret position after processing input
        updateCaret();
    }
}

function wordCheck() {
    if (guessArray.toString() === wordArray.toString()) {
        console.log("You got the word right");
        gameOn = false;
    } else if (currentGuess == lives) {
        console.log("Sorry, the word was " + word);
        gameOn = false;
    } else {
        guessArray = [];
        currentGuess++;
        guessLetter = 0;
        updateCaret(); // Ensure caret moves to the next row
    }
}
