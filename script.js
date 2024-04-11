// Global Variables
let lowerBox = document.getElementById("game-lower-box-container");
let lettersBox = document.getElementById("letters-box");

let wordLength = 6;
let correctEnteredLetters = [];
let currentInvalidNumber = 0;
let numberOfTries = 7;
let language = "en";
let word = "";

// Functions
function initGame() {
    // Initialize a word
    initWord();
    // Initialize the input fields
    initInputFields();
    // Initialize the letters buttons
    initLettersButtons();
}

function initInputFields() {
    for(let i = 1; i <= wordLength; i++) {
        let inputField = document.createElement("div");
        inputField.classList.add("input-field");
        inputField.id = "field-" + i;
        lowerBox.appendChild(inputField);
    }
}

function initLettersButtons() {
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let i = 0; i < letters.length; i++) {
        let letterButton = document.createElement("button");
        letterButton.classList.add("letter-button");
        letterButton.innerHTML = letters.charAt(i);
        letterButton.addEventListener("click", letterClicked);
        lettersBox.appendChild(letterButton);
    }
}

function letterClicked() {
    let clickedLetter = this.innerHTML;
    if(word.includes(clickedLetter)) {
        let countLetterInWord = countLetterOccurrencesInWord(clickedLetter);
        let countLetterInArray = countLetterOccurrencesInArray(clickedLetter);
        if(countLetterInWord.length > countLetterInArray.length) {
            if(countLetterInArray.length == 0) {
                let randomPlace = countLetterInWord[Math.floor(Math.random() * countLetterInWord.length)];
                let field = document.getElementById("field-" + (randomPlace + 1));
                field.innerHTML = clickedLetter;
                correctEnteredLetters[randomPlace] = clickedLetter;
            }
            else {
                let possiblePlaces = getPossiblePlaces(countLetterInWord, countLetterInArray);
                let randomPlace = possiblePlaces[Math.floor(Math.random() * possiblePlaces.length)];
                let field = document.getElementById("field-" + (randomPlace + 1));
                field.innerHTML = clickedLetter;
                correctEnteredLetters[randomPlace] = clickedLetter;
            }
            if(correctEnteredLetters.join("") === word) endGame("You Won :) The Word Is: \"" + word + "\", To Restart The Game Just Reload The Page", "green");
        }
        else invalid();
    }
    else invalid();
}

function getPossiblePlaces(occurrencesInWordArray, occurrencesInArrayArray) {
    let possiblePlaces = [];
    let index = 0;
    for(let i = 0; i < occurrencesInWordArray.length; i++) {
        if(!occurrencesInArrayArray.includes(occurrencesInWordArray[i])) {
            possiblePlaces[index] = occurrencesInWordArray[i];
            index++;
        }
    }
    return possiblePlaces;
}

function countLetterOccurrencesInWord(letter){
    let count = [];
    let index = 0;
    for(let i = 0; i < wordLength; i++) {
        if(word.charAt(i) === letter) {
            count[index] = i;
            index++
        }
    }
    return count;
}

function countLetterOccurrencesInArray(letter) {
    let count = [];
    let index = 0;
    for(let i = 0; i < correctEnteredLetters.length; i++) {
        if(correctEnteredLetters[i] === letter) {
            count[index] = i;
            index++
        }
    }
    return count;
}

function invalid() {
    currentInvalidNumber++;
    let hangedManPartReveal = document.getElementById("hanged-man-invalid-" + currentInvalidNumber);
    hangedManPartReveal.classList.remove("hidden-part");
    if(currentInvalidNumber == numberOfTries) endGame("You've Lost :( The Word Was: \"" + word + "\", To Restart The Game Just Reload The Page", "red");
}

function endGame(message, textColor) {
    let endGameBox = document.createElement("div");
    endGameBox.innerHTML = message;
    endGameBox.style.color = textColor;
    endGameBox.classList.add("after-game-box");
    document.body.appendChild(endGameBox);
    document.body.style.pointerEvents = "none";
}

function initWord() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "https://random-word-api.herokuapp.com/word?length=" + wordLength + "&lang=" + language, false);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            let json = JSON.parse(this.responseText);
            word = json[0].toUpperCase();
        }
    };
    xmlhttp.send();
}

// Listeners
window.addEventListener("load", initGame);