let aigameinfo = {
    chat: {

    },
    word: "",
    gametype: "",
    guesses: {  },
    guessesamount: {
        ai: 0,
        human: 0,
    },
    player: "",
    whosturn: "",
    aityping: false,
}

function fetchDataAndDisplayMessages() {
    const userId = userInfo.id; // The user's ID from userInfo global variable
    const gameRef = firebase.database().ref(`services/aigames/${userId}`);

    gameRef.once('value', (snapshot) => {
        const gameData = snapshot.val();

        if (gameData) {
            // Oppdater aigameinfo-objektet
            aigameinfo = {
                ...aigameinfo, // Behold eksisterende aigameinfo
                gametype: gameData.gametype || "",
                player: gameData.player || "",
                whosturn: gameData.whosturn || "",
                guessesamount: {
                    ai: gameData.guessesamount?.ai || 0,
                    human: gameData.guessesamount?.human || 0,
                },
                word: gameData.word || "",
                aityping: gameData.aityping,
            };

            // Sorter og oppdater chat og guesses
            const sortedChat = sortObjectByKeys(gameData.chat || {});
            const sortedGuesses = sortObjectByKeys(gameData.guesses || {});
            aigameinfo.chat = sortedChat;
            aigameinfo.guesses = sortedGuesses;

            // Oppdater DOM
            Object.keys(aigameinfo.chat).forEach((key) => {
                const chat = sortedChat[key];
                displayNewUserMessage(chat.content, chat.sender, chat.action.actiondescription, key); // antar at chat har disse feltene
            });

            console.log(aigameinfo.guesses)
            Object.keys(aigameinfo.guesses).forEach((key) => {
                console.log(key);
                const guessInfo = aigameinfo.guesses[key];
                const userType = guessInfo.hasOwnProperty('ai') ? 'ai' : 'human';
                const wordGuessed = guessInfo[userType];
                console.log(userType, wordGuessed);
                createRow(wordGuessed, userType, key); // Sende ordet gjettet, brukertype og nøkkel
            });

            updateDomElements(aigameinfo);
        }
    });
}

function sortObjectByKeys(obj) {
    return Object.keys(obj).sort((a, b) => parseInt(a.slice(2)) - parseInt(b.slice(2)))
        .reduce((res, key) => (res[key] = obj[key], res), {});
}

function updateChatData(chatData) {
    Object.keys(chatData).forEach((chatKey) => {
        const chatEntry = chatData[chatKey];
        //console.log(chatEntry)
        if (chatEntry && chatEntry.action) {
            // Update the aigameinfo object with the action
            const chatname = 'ch' + (chatKey + 1)
            aigameinfo.chat[chatname] = chatEntry;
            //console.log(aigameinfo.chat[chatname])
            const currchat = aigameinfo.chat[chatname];

            createMessage(currchat.content, 0, currchat.sender, currchat.action.actiondescription, currchat.action.word, chatname);
        }
    });
}

function updateGuessesData(guessesData) {
    Object.keys(guessesData).forEach((guessKey) => {
        const guessEntry = guessesData[guessKey];
        if (guessEntry) {
            // Your code to update the guesses in aigameinfo
            // For example:
            aigameinfo.guesses[guessKey] = guessEntry;
        }
    });
}

function commitGuess(wordguessed, chatcontent) {
    const userId = userInfo.id; // Sørg for at userInfo.id er definert og tilgjengelig
    const gameRef = firebase.database().ref(`services/aigames/${userId}`);

    gameRef.once('value', (snapshot) => {
        const aigameinfo = snapshot.val();

        let newGameData = {
            chat: aigameinfo.chat || {},
            word: aigameinfo.word,
            gametype: aigameinfo.gametype,
            guesses: aigameinfo.guesses || {},
            guessesamount: aigameinfo.guessesamount,
            player: aigameinfo.player,
            aityping: aigameinfo.aityping,
            whosturn: "ai",
        };

        const chatKey = 'ch' + (Object.keys(newGameData.chat).length + 1);
        newGameData.chat[chatKey] = {
            content: chatcontent,
            sender: "human",
            action: {
                actiondescription: `${userInfo.username} guessed ${wordguessed}`,
                actiontype: "guessword",
                word: wordguessed,
            }
        };

        const guessKey = 'w' + (Object.keys(newGameData.guesses).length + 1);
        newGameData.guesses[guessKey] = {
            human: wordguessed
        };

        newGameData.guessesamount.human += 1;

        // Lagrer de nye dataene til Firebase
        gameRef.set(newGameData, error => {
            if (error) {
                console.error("Data could not be saved." + error);
            } else {
                console.log("Data saved successfully.");
                // Her kan vi kalle Gemini prompt funksjonen etter en vellykket oppdatering
                //aigameinfo = newGameData;
                console.log(aigameinfo)
                console.log(newGameData)
                const promptsent = generateGeminiPrompt(newGameData, getChatMessages());
                const tasklistRef = firebase.database().ref(`services/tasklist`);
                const updateData = {
                    [userId]: {
                        prompt: promptsent,
                    }
                };

                tasklistRef.update(updateData, (error) => {
                    if (error) {
                        console.error("Data could not be updated." + error);
                    } else {
                        console.log("Data updated successfully.");
                    }
                });
                console.log(prompt);

                fetchDataAndDisplayMessages()
                // ... og her kan du sende prompt til Gemini
            }
        });
    });
}

function listenForAITyping() {
    const aitypingRef = firebase.database().ref(`services/aigames/${userInfo.id}/aityping`);
    const whosturnRef = firebase.database().ref(`services/aigames/${userInfo.id}/whosturn`);

    aitypingRef.on('value', (snapshot) => {
        const isAityping = snapshot.val();
        AIisTyping(isAityping);
        if (isAityping) {
            // AI skriver nå, vent på endringer i chat
            listenForNewMessages();
        }
    });

    whosturnRef.on('value', (snapshot) => {
        const newWhosTurn = snapshot.val();
        if (newWhosTurn !== undefined && newWhosTurn !== aigameinfo.whosturn) {
            aigameinfo.whosturn = newWhosTurn; // Oppdaterer whosturn i aigameinfo
            // Oppdater DOM eller andre elementer etter behov
            updateDomElements(aigameinfo)
        }
    });
}

function listenForNewMessages() {
    const chatRef = firebase.database().ref(`services/aigames/${userInfo.id}/chat`);

    chatRef.on('value', (snapshot) => {
        const newChatData = snapshot.val();
        if (newChatData && Object.keys(newChatData).length > Object.keys(aigameinfo.chat).length) {
            // Det har kommet nye meldinger
            const sortedChat = sortObjectByKeys(newChatData);
            updateChatData(sortedChat); // Denne funksjonen må også implementere logikk som unngår duplisering
            updateDomElements(aigameinfo); // Oppdater DOM-elementer basert på nye data
        }
    });
}



/*
let aigameinfo = {
    chat: {

    },
    word: "",
    gametype: "",
    guesses: {  },
    guessesamount: {
        ai: 0,
        human: 0,
    },
    player: "",
    whosturn: "",
}
* */