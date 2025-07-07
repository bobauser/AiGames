
function createRow(letters, username, key) {
    // Oppretter et nytt 'div' element for raden.
    if (!document.getElementById(`guess-${key}`)) {
        const parentrow = document.createElement('div');
        parentrow.classList.add("rowwithname")
        parentrow.id = `guess-${key}`;
        const row = document.createElement('div');
        const nameval = document.createElement('p')
        nameval.textContent = username === "ai" ? "AI" : userInfo.username;
        const classname = username === "ai" ? "ai" : "human";
        nameval.classList.add(classname)
        row.classList.add('row');
        const lettersArray = letters.split('');
        // Legger til bokstavceller til raden.
        lettersArray.forEach((letter, index) => {
            const letterClass = getClassForLetter(letter, index);
            const letterCell = document.createElement('div');
            letterCell.classList.add('word-cell', letterClass);
            letterCell.textContent = letter.toUpperCase(); // Ingen behov for å sjekke undefined her siden vi forventer en bokstav
            letterCell.style.animationDelay = `${0.1 * index}s`; // Legger til animasjonsforsinkelse.

            // Legger til bokstavcellen til raden.
            row.appendChild(letterCell);
        });
        parentrow.appendChild(nameval)
        parentrow.appendChild(row)
        // Legger til hele raden til '.word-grid'.
        document.querySelector('.wordRows').appendChild(parentrow);
        try {
            document.querySelector('.wordRows .emptyrows').remove()
        } catch (error) {}
    }
}


function displayNewUserMessage(message, user, action, key) {
    if (!document.getElementById((`msg-${key}`))) {
        const typeofsender = user.toLowerCase() === "ai" ? "other" : "you";
        const actionText = action ? `<p>${action}</p>` : '';
        const html = `<div id="guess-${key}" class="chat-message new ${typeofsender}">
        ${typeofsender === "you" ? actionText : ''}
        <span>${message}</span>
        ${typeofsender === "other" ? actionText : ''}
        </div>`;
        const chatsection = document.querySelector(".content .chat-section")
        const wordrows = document.querySelector(".wordRows")
        chatsection.innerHTML += html;
        chatsection.scrollTo({ top: chatsection.scrollHeight, behavior: 'smooth' });
        setTimeout(() => {
            // Finner den siste tilføyde meldingen med 'new' klassen
            const newMessages = chatsection.querySelectorAll(".chat-message.new"); //.chat-message.new
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage) {
                lastMessage.classList.remove("new");
            }
            wordrows.scrollTo({ top: wordrows.scrollHeight, behavior: 'smooth' });
        }, 500);
    }
}

function updateDomElements(gameInfo) {
    // Your code to update the DOM based on the updated gameInfo
    // For example:
    document.querySelector(".game_type").innerText = "Game: " + gameInfo.gametype;
    document.querySelector(".game-player").innerText = "Who plays: " + gameInfo.player;
    document.querySelector(".word-to-guess").innerText = gameInfo.word;

    let guessesMadeAI = 0;
    let guessesMadeHuman = 0;

// Iterate over the guesses to count AI and Human guesses separately
    Object.values(aigameinfo.guesses).forEach((value) => {
        if ('ai' in value) guessesMadeAI++;
        if ('human' in value) guessesMadeHuman++;
    });

    let guessesTotalAI = aigameinfo.guessesamount.ai;
    let guessesTotalHuman = aigameinfo.guessesamount.human;

// Update the DOM elements with the counts
    document.querySelector(".game-guesses .ai").innerText = `AI guesses: ${guessesMadeAI} of ${guessesTotalAI} total`;
    document.querySelector(".game-guesses .human").innerText = `Human guesses: ${guessesMadeHuman} of ${guessesTotalHuman} total`;
    checkWhosTurn()

}

function checkWhosTurn() {
    const inputs = document.getElementById("inputs");
    const textinput = inputs.querySelector(".guess-input");
    const button = inputs.querySelector(".guess-button");

    // Always set the placeholder for the text input
    textinput.placeholder = "Write Something...";

    if (aigameinfo.whosturn === "ai") {
        // If it's AI's turn, disable both the text input and button
        textinput.disabled = true;
        textinput.classList.add("locked")
        textinput.placeholder = "Wait for AI's turn"
        button.disabled = true;
        button.classList.add("locked")
    } else {
        // If it's the human player's turn, enable both the text input and button
        textinput.disabled = false;
        textinput.classList.remove("locked")
        if (textinput.classList.contains("type-word")) {
            textinput.placeholder = "Guess A Word..."
        } else {
            textinput.placeholder = "Write Something..."
        }
        button.disabled = false;
        button.classList.remove("locked")
    }
}

function addGuessedWord(word) {
    const guessInput = document.querySelector("#inputs .guess-input");
    const wordelement = document.getElementById("word-guessed")
    wordelement.innerText = word;

    wordelement.classList.add("show")
    wordelement.classList.remove("hide")

    guessInput.classList.add("type-sentence")
    guessInput.classList.remove("type-word")
    //#word-guessed
}