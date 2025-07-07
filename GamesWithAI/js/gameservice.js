//Submits from input
function addGuessToList(guess) {

    const length = Object.keys(aigameinfo.guesses).length
    const wordname = 'w' + (length+1)
    aigameinfo.guesses[wordname] = guess;

    let guessesMade = Object.keys(aigameinfo.guesses).length;
    let guessesTotal = aigameinfo.guessesamount;

    //aigameinfo
}
//message, userInfo.id, userInfo.username, prompt
function typeword(word) {
    addGuessedWord(word);
    checkWhosTurn();
}

function createUserMessage(message, userid, username) {
    const guessInput = document.querySelector("#inputs .guess-input");
    const wordelement = document.getElementById("word-guessed")
    wordelement.classList.remove("show")
    wordelement.classList.add("hide")
    const guessedword = wordelement.innerText;

    guessInput.classList.remove("type-sentence")
    guessInput.classList.add("type-word")
    const prompt = ' has guessed "' + guessedword + '"';
    //createMessage(message, userid, username, prompt, guessedword)
    commitGuess(guessedword, message);
}

function createMessage(message, userid, username, prompt, guessedword, key) {
    displayNewUserMessage(message, username, prompt, key)
    createRow(guessedword, username)
    addGuessToList(guessedword)
    // Tømmer input-feltet
}

function generateGeminiPrompt(aigameinfo) {
    const { word, guesses, guessesamount } = aigameinfo;

    let guessedWordsInfo = 'Your guesses:\n';
    Object.values(guesses).forEach((guess, index) => {
        if (guess.ai) {
            guessedWordsInfo += `${index + 1}. "${guess.ai}"\n`;
        }
        if (guess.human) {
            guessedWordsInfo += `${index + 1}. "${guess.human}"\n`;
        }
    });

    let chatInfo = 'Human player\'s clues:\n';
    Object.values(aigameinfo.chat).forEach((chat, index) => {
        if (chat.sender === 'human') {
            chatInfo += `${index + 1}. "Human's chat message: "${chat.content}""\n`;
        }
    });

    const prompt = `You are playing a game of Wordle with a human player. The word to guess is ${word.length} characters long. Each player has a total of 15 guesses. You have guessed ${guessesamount.ai} time(s) so far.\n${guessedWordsInfo}${chatInfo}Using this information, make your next guess. Your response MUST follow a format to be parsed correctly, you can send a chat aswell as guess a word, your response should look like this "CHATSENTANCE*WORD*" format. Good luck! And try to not guess the same word twice!`;

    return prompt;
}

// For å hente chatmeldinger, bruker vi en funksjon som henter teksten fra hver chat-boble.
function getChatMessages() {
    const chatBubbles = document.querySelectorAll('.chat-section .chat-message.you p');
    const chatMessages = Array.from(chatBubbles).map(p => p.textContent.trim());
    return chatMessages;
}

/*function getChatMessages() {
    const chatBubbles = document.querySelectorAll('.chat-section .chat-message.you p');
    const array = Array.from(chatBubbles)
    const latest = array[array.length]
    return latest;
}*/

/*
// Kall getChatMessages for å hente chatmeldinger fra DOM
const chatMessages = getChatMessages();

// Generer prompten
const prompt = generateGeminiPrompt(aigameinfo, chatMessages);

// Bruk denne prompten til å sende til Gemini
console.log(prompt);
*/

// createMessage("I'll try Phone", 0, "Karl", "Karl tried Phone", "Phone") //HUMAN message
// createMessage("Me is robot", 0, "ai", "Ai tried Bread", "Bread") //AI message