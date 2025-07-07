var popwindow

async function spendingHistory() {
    popwindow = document.getElementById("popup-window");
    popwindow.querySelector(".title-black").innerHTML = "Spending History";
    var html = "";
    var dateelements = [];
    var itemElements = []
    var noteElements = []

    await firebase.database().ref(`content/${userInfo.id}/economy/${getMonthYear()}/spendhistory`).once("value")
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val())
                //if (snapshot.val)
                var currentChore = ""
                Object.entries(snapshot.val()).forEach(([key, value]) => {
                    //console.log(key + " " + value);
                    let note = {}
                    for (const [k, v] of Object.entries(value)) { //notes: "input", or items: [Object]
                        if (k === 'items') {
                            console.log(k + " " + v)
                            let items = {
                                datakey: key,
                                food: 0,
                                rent: 0,
                                loans: 0,
                                miscellaneous: 0,
                                self_defined_items: 0
                            }
                            for (const [i, v2] of Object.entries(v)) {
                                console.log(i + " " + v2)
                                if (i === "self-defined-items") {
                                    items["self_defined_items"] = v2
                                }
                                else {
                                    items[i] = v2
                                }
                            }
                            itemElements.push(items)
                        } else {
                            let noteElement = {
                                datakey: key,
                                note: v
                            }
                            noteElements.push(noteElement)
                        }
                    }
                    let chore = {
                        datakey: key,
                        /*items,*/
                        note
                    }
                    //listelements.push(chore);
                    var itemstring = "";
                    const year = key.substring(4, 6);
                    const month = key.substring(7, 9);
                    const day = key.substring(9, 11);
                    const hour = key.substring(12, 14);
                    const minute = key.substring(15, 17);
                    const second = key.substring(19, 21);
                    var monthvar = parseInt(month) - 1;
                    if (currentChore === "" || currentChore !== key.substring(0, 11)) {
                        dateelements.push(`<button class="zoombutton" data-key="${key}">${monthNames[monthvar]} ${day}</button>`); //(${hour}:${minute})
                        currentChore = key.substring(0, 11)
                        console.log(currentChore)
                    }

                    var monthvar = parseInt(month) - 1;
                });
                html = `<div class="left-container"></div><div class="right-container"></div>`;
                //console.log(listelements)
                console.log(itemElements)
                console.log(noteElements)
                console.log(dateelements)
            } else {
                html = "No History Available";
            }
        });
    function showItemsDta(datakey) { //datakey.substring(0, 11)
        popwindow.querySelector(".right-container").innerHTML = "";
        for (let i = 0; i < itemElements.length; i++) {
            const datak = itemElements[i].datakey
            const datak2 = noteElements[i].datakey
            if (datak.substring(0, 11) === datakey.substring(0, 11)) {
                let note = noteElements[i]
                let types = itemElements[i]

                let ul = document.createElement("ul")
                Object.entries(types).forEach((type) => {
                    console.log(type)
                    if (type[0] !== "datakey") {
                        if (type[1] < 1) {
                            console.log("buhu")
                        } else {
                            ul.innerHTML += `<li>${type[0]}: ${type[1]}${currentCurrencySymbol}</li>`;
                        }
                    }
                })
                let time = datak.substring(12, 20).split("-")
                let time2 = time[0] + ":" + time[1] + ` ${time[2]}s`
                let parentel = document.createElement("p")
                parentel.innerHTML = time2
                parentel.appendChild(ul)
                ul.innerHTML += `<li>Notes: ${note.note}</li>`;
                popwindow.querySelector(".right-container").appendChild(parentel)
            }
        }
    }


    popwindow.querySelector(".content").innerHTML = html;
    dateelements.forEach((item) => {
        popwindow.querySelector(".left-container").innerHTML += item
    })
    const leftButtons = popwindow.querySelectorAll(".left-container button");
    leftButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Remove the "pressed" class from all buttons
            leftButtons.forEach((btn) => btn.classList.remove("pressed"));

            // Add the "pressed" class to the clicked button
            button.classList.add("pressed");

            // Call your showItemsDta function here
            showItemsDta(button.getAttribute("data-key"));
        });
    });

    popwindow.querySelector(".content").classList.add("spending-grid");
    ShowPopUpWindow();
}



function howDoYouCreateaBudget() {
    popwindow = document.getElementById("popup-window");
    popwindow.querySelector(".title-black").innerHTML = "How to create a Budget"
    popwindow.querySelector(".content").innerHTML = textblocks.makeabudget
    ShowPopUpWindow()
}

function whatIsaSpendingChore() {
    popwindow = document.getElementById("popup-window");
    popwindow.querySelector(".title-black").innerHTML = "What is a Spending Chore"
    popwindow.querySelector(".content").innerHTML = "Something you don't know ab ignorant twat"
    ShowPopUpWindow()
}

function whatIsanException() {
    popwindow = document.getElementById("popup-window");
    popwindow.querySelector(".title-black").innerHTML = "What is an Exception?"
    popwindow.querySelector(".content").innerHTML = "Something you don't know ab ignorant twat"
    ShowPopUpWindow()
}

function renewBudget() {
    popwindow = document.getElementById("popup-window");
    popwindow.querySelector(".title-black").innerHTML = "Renew Budget"
    var html = `<h2 style="margin: 0">Make Any Changes before saving</h2>                
                <button class="revert-button medium-button"><i class="fa-solid fa-rotate-left"></i> Revert Changes</button>    
                <label class="info-text">Currency</label>
                <select class="currency-select" required>
                    <option value="USD">United States Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="JPY">Japanese Yen (JPY)</option>
                    <option value="GBP">British Pound Sterling (GBP)</option>
                    <option value="AUD">Australian Dollar (AUD)</option>
                    <option value="CAD">Canadian Dollar (CAD)</option>
                    <option value="CHF">Swiss Franc (CHF)</option>
                    <option value="CNY">Chinese Yuan (CNY)</option>
                    <option value="SEK">Swedish Krona (SEK)</option>
                    <option value="NZD">New Zealand Dollar (NZD)</option>
                    <option value="MXN">Mexican Peso (MXN)</option>
                    <option value="SGD">Singapore Dollar (SGD)</option>
                    <option value="HKD">Hong Kong Dollar (HKD)</option>
                    <option value="NOK">Norwegian Krone (NOK)</option>
                    <option value="KRW">South Korean Won (KRW)</option>
                    <option value="TRY">Turkish Lira (TRY)</option>
                    <option value="RUB">Russian Ruble (RUB)</option>
                    <option value="INR">Indian Rupee (INR)</option>
                    <option value="BRL">Brazilian Real (BRL)</option>
                    <option value="ZAR">South African Rand (ZAR)</option>
                </select>            
                <div class="add-item-container" style="width: auto">
                    <p class="add-item">Budget<input class="budget-number" type="number" min="0" value="0" data-key="budget" required></p>
                    <p class="add-item">Food <i class="fa-solid fa-utensils"></i><input type="number" min="0" value="0" data-key="food" required></p>
                    <p class="add-item">Rent <i class="fa-solid fa-building"></i><input type="number" min="0" value="0" data-key="rent" required></p>
                    <p class="add-item">Loans <i class="fa-solid fa-sack-dollar"></i><input type="number" min="0" value="0" data-key="loans" required></p>
                    <p class="add-item">Miscellaneous <i class="fa-solid fa-mask"></i><input type="number" min="0" value="0" data-key="miscellaneous" required></p>
                    <p class="add-item">Self Defined Items <i class="fa-solid fa-magnifying-glass-dollar"></i><input type="number" min="0" value="0" data-key="self-defined-items" required></p>
                </div>
                <button type="button" class="medium-button" onclick="calculate('#popup-window')">Calcuclate Budget From Items</button>
                <button type="button" class="medium-button" id="crbbutton">Create New Budget</button>`
    popwindow.querySelector(".content").innerHTML = html
    /*Enter values under*/
    function revert() {
        popwindow.querySelector('.add-item-container input[data-key="budget"]').value = lastMonthBudget.budget;
        if (lastMonthBudget.items !== undefined) {
            const items = lastMonthBudget.items;
            Object.keys(items).forEach((key) => {
                const value = items[key];
                const inputElement = popwindow.querySelector(`.add-item input[data-key='${key}']`);
                if (inputElement) {
                    inputElement.value = value;
                }
            });
        }
    }
    function crB() {
        var listofitems = popwindow.querySelectorAll(".add-item input");
        let itemsWithBudget = []
        listofitems.forEach((item) => {
            // Check if item value is a valid number and greater than 0
            if (!isNaN(item.value) && parseInt(item.value) > 0) {
                const tag = item.getAttribute("data-key");
                itemsWithBudget[tag] = parseInt(item.value); // Simplify the structure
            }
        });
        let budget = {
            monthyear: getMonthYear(),
            budget: parseInt(popwindow.querySelector('.add-item-container input[data-key="budget"]').value),
            currency: popwindow.querySelector(".currency-select").value,
            items: itemsWithBudget
        };
        console.log(budget);
        firebase.database().ref("content/" + userInfo.id + "/economy/" + budget.monthyear).update(budget)
            .then(() => {
                console.log("Successfully created budget");
                HidePopUpWindow()
                showNotificationBox("Successfully Updated Budget", "inform")
                checkBudget()
            }).catch((error) => {
            console.log(error);
        });
    }
    popwindow.querySelector(".revert-button").addEventListener("click", revert);
    popwindow.querySelector("#crbbutton").addEventListener("click", crB);
    revert()
    popwindow.querySelector(".cancel-button").innerHTML = "Cancel"
    ShowPopUpWindow()
}


function clickInputs(inputfield, istext) {
    if (window.innerWidth < 1000) {
        popwindow = document.getElementById("popup-window");
        popwindow.querySelector(".title-black").innerHTML = `Assign ${inputfield.textContent}`
        popwindow.querySelector(".content").innerHTML = `<input id="rep-put" class="big-field" placeholder="Type Value"> <button id="assign-rep-button" class="loppybutton">Assign input</button>`
        popwindow.querySelector(".cancel-button").innerHTML = "Cancel"
        ShowPopUpWindow()
        function assignToInput() {
            if (istext === true) {
                inputfield.textContent = popwindow.querySelector("input").value
                HidePopUpWindow()
            } else if (popwindow.querySelector("input").value >= 0) {
                inputfield.querySelector("input").value = popwindow.querySelector("input").value
                HidePopUpWindow()
            }
        }
        popwindow.querySelector("#assign-rep-button").addEventListener("click", assignToInput)
    }
}