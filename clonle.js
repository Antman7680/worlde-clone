const wordList = ["apple"];
const alphabetWord = "qwertyuiopasdfghjklzxcvbnm";
const letterList = alphabetWord.split('');
let lives = 6;
let currentGuess = 0;

let word;
let wordArray;

let guessArray = [];

let guessLetter = 0;

function chooseWord(){
    let num = Math.floor(Math.random() * wordList.length);
    word = wordList[num];
    wordArray = word.split('');
}

var body = document.getElementById("body");//Creates a var for the body
body.addEventListener("keyup", (e) => {//Creates an event listener that listens for when the user presses a key and it goes up
    key = e.key;
    let isLetter = isChar(key);
    guess(isLetter);
});

function isChar(k){
    k = k.toLowerCase();
    let isC = false;

    for(let i = 0; i<letterList.length; i++){
        if(letterList[i]===k){
            isC = true;
        }
    }
    if (isC){
        return k;
    }
    else if (k =="backspace"){
        return k;
    }
    else if (k == "enter") {
        return k;
    }
    else{
        return "";
    }
}

function guess(input){
    if (input == "backspace" && guessLetter>=0){
        if (guessLetter != 0) {
            guessLetter--;
        }
        document.getElementById(currentGuess + ":" + guessLetter).innerHTML = ("");
        guessArray.pop();
        console.log("remove");
    }
    else if (input == "enter" && guessLetter == 5){
        currentGuess++;
        guessLetter = 0;
    }
    else if (input != "enter" && input!="" && guessLetter <= 4 && input != "backspace") {
        document.getElementById(currentGuess +":" + guessLetter).innerHTML = (input.toUpperCase());
        guessArray[guessLetter] = input;
        guessLetter++;
    }
    console.log(guessArray);
}

chooseWord();
console.log(word);
console.log(wordArray);
// console.log(letterList);