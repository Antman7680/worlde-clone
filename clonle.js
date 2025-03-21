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
let guessLetter = 0;

let word = "";
let wordArray = [];

let guessWord = "";
let guessArray = [];

let displayWordArray = [];

let rotateDegree = 0;

function chooseWord() {
    let num = Math.floor(Math.random() * wordList.length);
    word = wordList[num];
    wordArray = word.split('');
}

window.onload = function () {
    // Attach keyup event listener ONCE when the page loads
    document.addEventListener("keyup", (e) => {
        if (!gameOn) return; // Ignore input if the game is over

        const key = e.key.toLowerCase();
        const isLetter = isChar(key);
        guess(isLetter); // Passes valid letters to the guess function
    });
    document.querySelectorAll(".key").forEach(key => {
        key.addEventListener("click", () => {
            guess(key.innerText.toLowerCase()); // Call your guess function
        });
    });

    const backspaceKey = document.querySelector(".backspace");
    if (backspaceKey) {
        backspaceKey.addEventListener("click", () => guess("backspace"));
    }

    const enterKey = document.querySelector(".enter");
    if (enterKey) {
        enterKey.addEventListener("click", () => guess("enter"));
    }

    startGame(); // Start the game
};

function startGame() {
    if (!gameOn) return;

    waitForWordList(() => {
        chooseWord();
        console.log("Selected word:", word);
        console.log("Word array:", wordArray);

        lives = 6;
        guessWord = "";
        guessArray = [];
        displayWordArray = Array(wordArray.length).fill("_");

        updateCaret();
    });
}

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
        }
        else if (input === "enter" && guessLetter === 5) {
            wordCheck();
        }
        else if (input !== "enter" && input && guessLetter < 5 && input !== "backspace") {
            document.getElementById(`${currentGuess}:${guessLetter}`).innerHTML = input.toUpperCase();
            guessArray[guessLetter] = input;
            guessLetter++;
            guessWord += input;
        }
        // Update the caret position after processing input
        updateCaret();
    }
}

function wordCheck() {
    displayWordArray = [];
    for (let i = 0; i < guessArray.length; i++) {
        let letter = guessArray[i];
        let countLetter = 0;

        for (let j = 0; j < wordArray.length; j++) {
            if (letter == wordArray[j]) {
                countLetter++;
            }
        }

        for (let k = 0; k < displayWordArray.length; k++) {
            if (letter == displayWordArray[k]) {
                countLetter--;
            }
        }

        let cell = document.getElementById(`${currentGuess}:${i}`);
        let keyElement = document.querySelector(`.key[data-key="${letter}"]`); // Find the corresponding key

        if (countLetter > 0 && letter == wordArray[i]) {
            cell.style.color = "green";
            if (keyElement) keyElement.style.backgroundColor = "green"; // Update keyboard color
        }
        else if (countLetter > 0 && wordArray.includes(letter)) {
            cell.style.color = "yellow";
            if (keyElement) keyElement.style.backgroundColor = "yellow";
        }
        else {
            cell.style.color = "red";
            if (keyElement) keyElement.style.backgroundColor = "gray"; // Gray for incorrect letters
        }

        displayWordArray[i] = letter;
    }

    if (guessArray.toString() === wordArray.toString()) {
        console.log("You got the word right");
        gameOn = false;
    }
    else if (currentGuess == lives) {
        console.log("Sorry, the word was " + word);
        gameOn = false;
    }
    else {
        guessArray = [];
        currentGuess++;
        guessLetter = 0;
        updateCaret();
    }
}
