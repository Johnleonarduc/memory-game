/*Enable Local Storage across all browsers that does not support it yet 
Credit: https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage*/
if (!window.localStorage) {
    window.localStorage = {
      getItem: function (sKey) {
        if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
        return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
      },
      key: function (nKeyId) {
        return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
      },
      setItem: function (sKey, sValue) {
        if(!sKey) { return; }
        document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
        this.length = document.cookie.match(/\=/g).length;
      },
      length: 0,
      removeItem: function (sKey) {
        if (!sKey || !this.hasOwnProperty(sKey)) { return; }
        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        this.length--;
      },
      hasOwnProperty: function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
      }
    };
    window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
  }

/*
Declaration/Initialization of Global variables/values
*/
let moveCounter = 0;
let cardsMatchCounter = 0;
let counter = 0;
let gameTimer = document.querySelector('.timer');
let strnMins ="";
let strnSecs ="";
let timerId; //did not work with either const or let, so I used var
//Using local Storage to initialize values for the game
localStorage.setItem("openCard", "card open show"); //initialize value for an open card
localStorage.setItem("closeCard", "card"); //initialize value for a closed card
localStorage.setItem("cardsMatch", "card open match fa-spin"); //initialize value for cards that matches
localStorage.setItem("seconds", 0); //initialize value for the timer seconds
localStorage.setItem("minutes", 0); //initialize value for the timer minutes
localStorage.setItem("gameState", "toStart"); //initialize the game state
localStorage.setItem("instructionState", 1); //initialize the instructionState for tracking when the game instructions was opened and closed
localStorage.setItem("rating", "3/3 - Professional"); //initialize the game rating to maximum

/*
All functions Declaration
*/
// Shuffle function from http://stackoverflow.com/a/2450976 helps to shuffle the cards
function shuffle(cards) {
    var currentIndex = cards.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
    return cards;
}

/*
 * The MakeCardDeck function creates a list that creates and holds all of the cards when called
 */
function makeCardDeck(){
    //Create array to hold the 8 card pairs.
    const cardlist = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
    const cards = cardlist.concat(cardlist); //duplicate array of 8 cards
    //create the <ul> element
    let cardDeck = document.createElement('ul');
    //assign classname to the <ul> element
    cardDeck.className = "deck";
    //shuffle the cards
    shuffle(cards);
    //create a document fragment to hold created list of cards for better performance
    const fragment = document.createDocumentFragment();
    //create list of cards
    for(let card of cards){
        //create the list element
        let cardList = document.createElement('li');
        //assign class to the list element
        cardList.className = "card";
        //create <i> element for the  card icons
        let cardIcon = document.createElement('i');
        //assign class bearing names of the respective cards in the shuffled cards.
        cardIcon.className = `fa ${card}`;
        //append the <i> tags to the current list item
        cardList.appendChild(cardIcon);
        //append this list item to the document fragment
        fragment.appendChild(cardList);
    }
    //append the document fragment of containing all list of cards to the <ul> tag
    cardDeck.appendChild(fragment);
    //selct the container div and append the card deck of cards
    document.querySelector('.container').appendChild(cardDeck);
}

/*
*The MakeModalStruct function is responsible for making the modal anytime it is called
*It is designed in a dynamic way using if statements so that it changes at start and at finish
*/
function makeModalStruct(){
    /*
    *define function global variables for the modal
    * make basic structure
    */
    let modalContainer = document.createElement('div'); //container div for modal
    let modalContent = document.createElement('div'); //wrapper for modal contents inside modal container div
    let modalHeader = document.createElement('header'); //modal header inside modal content
    let modalBody = document.createElement('div'); //modal body inside modal content
    let modalFooter = document.createElement('footer'); //modal footer inside modal content
    modalContainer.className = "modal-container"; //assign class to modal container div
    modalContent.className = "modal-content"; //assign class to wrapper for modal contents 
    modalHeader.className = "modal-header"; //assign class to modal header
    modalBody.className = "modal-body"; //assign class to modal body
    modalFooter.className = "modal-footer"; //assign class to modal footer

   //Dynamic Modal Header Information
    let modalHeaderEl = document.createElement('h1'); //modal header information
    //if game is just starting, display Matching Game on the Modal header
    if(localStorage.gameState === 'toStart'){
        modalHeaderEl.innerText = "Matching Game";
        modalHeader.appendChild(modalHeaderEl); //append the modal header information to the modal Header
    }
    //if game is completed successfully, display Congratulations and player name on the Modal header
    if(localStorage.gameState === 'win'){
        modalHeaderEl.innerHTML = ` Congratulations ${localStorage.getItem('player')}`;
        modalHeader.appendChild(modalHeaderEl); //append the modal header information to the modal Header
    }
    //append the modal header with dynamic information to the modal content 
    modalContent.appendChild(modalHeader);

    //Dynamic Modal Body Information
    //if game is just starting, display a text form field for name and a spining gamepad with a play text under it
    if(localStorage.gameState === 'toStart'){
        //code for displaying a text form field for name
        let modalBodyContent = document.createElement('div'); //create a container div for all modal body contents

        modalBodyContent.setAttribute("class", "modal-body-area-to-start"); //assign it a class of modal-body-area-to-start
        
        let formArea = document.createElement('div'); //create a division for holding the form
        formArea.setAttribute("class", "form-area"); //assign it a class

        let userdata = document.createElement('form'); //create the form HTML element
        let nameLabel = document.createElement('label'); //create a label HTML element
        nameLabel.setAttribute("class", "name-text"); //assign a class to the label tag
        nameLabel.innerHTML = "Enter your name to play: "; //Text to display as form label
        userdata.appendChild(nameLabel); //append the label text to the form element   

        let nameInputEl = document.createElement('input'); //create an input element
        nameInputEl.setAttribute("type", "text"); //declare the input element as a text type
        nameInputEl.setAttribute("maxlength", "12"); //give it a maximum length of 12 characters
        nameInputEl.setAttribute("class", "text-area"); //assign it a class
        nameInputEl.setAttribute("placeholder", "Your Name Here"); //give a placeholder text. This text will show inside the text-field prior to any input from user
        nameInputEl.addEventListener('keypress', function (e) { //add an event listener to the text field to listen for when the enter key is pressed.
            if (13 == e.keyCode) {
                inputProcessor(); //if enter key is pressed, call inputProcessor function to process input.
                e.preventDefault(); //stop enter key from submitting to server
            }
        });
        userdata.appendChild(nameInputEl); //append the input element to the form element as its child.
        formArea.appendChild(userdata); //append the form element as a child of the div for the form area
        modalBodyContent.appendChild(formArea); //append the form div to the container div for all modal body contents

        //code for displaying a spining gamepad and play text
        let playButttonArea = document.createElement('div'); //create a div to contain the items
        playButttonArea.setAttribute("class", "play-buttton-Area"); //assign it a class

        let gamePadImg = document.createElement('i'); //create an i element for the font-awesome icons
        gamePadImg.setAttribute("class", "fas fa-gamepad icon-large fa-spin"); //assign it a classes. These class are responsible for displaying(fa-gamepad), sizing(icon-large) & spinning(fa-spin) the gamepad.
        gamePadImg.addEventListener('mouseenter', function(){ //assign another event listener for when a mouse pointer hovers over the gamepad, it stops spinning
            document.querySelector('.fa-gamepad').classList.remove('fa-spin');
        });
        gamePadImg.addEventListener('mouseleave', function(){ //assign another event listener for when a mouse leaves over the gamepad, it continues spinning
            document.querySelector('.fa-gamepad').classList.add('fa-spin');
        });
        playButttonArea.appendChild(gamePadImg); //append this gamepad to the play button area div created

        let brText = document.createElement('br'); //create a line break element
        playButttonArea.appendChild(brText); //append the line break element below the gamepad in the play button area div

        let playText = document.createElement('span'); //create a span element for the play text
        playText.setAttribute("class", "play-text"); //assign it a class
        playText.innerText = "Play" //Text to display

        playButttonArea.appendChild(playText); //append it below the line break in the play button area div
        playButttonArea.addEventListener('click', function(){ //assign it a click event listener whick calls the input processor to trigger the game to begin
            inputProcessor();
        });
        modalBodyContent.appendChild(playButttonArea); //finally append the play button area div to the container div for all modal body contents
        modalBody.appendChild(modalBodyContent); //then append the modal body content and its information to the body of the modal
    }
    //if the user has successfully completed the game, display a congratulatory message, results from the game play like star rating level, number of moves made, time exhausted, and also an image of a trophy.
    if(localStorage.gameState === 'win'){
        let modalBodyContent = document.createElement('div'); //create container for holding all the results and congratulatory message
        modalBodyContent.setAttribute("class", "modal-body-area-win"); //assign it a class

        let resultScoresPage = document.createElement('div'); //create a div for just the scores
        resultScoresPage.setAttribute("class", "result-scores-area"); //assign it a class

        let youWonMessage = document.createElement('p'); //create a p element for the congratulatory message 'You won!!!'
        youWonMessage.setAttribute("class", "you-won-mesage"); //assign it a class
        youWonMessage.innerHTML = "You Won !!!"; //text to display

        let starRatingMessage = document.createElement('p'); //create a p element for the star rating message
        starRatingMessage.setAttribute("class", "result-message"); //assign it a class
        starRatingMessage.innerHTML = `Your Star rating was ${localStorage.rating}`; //text to display. Rating value is gotten from local storage

        let nmovesMessage = document.createElement('p'); //create a p element for the number of moves made message
        nmovesMessage.setAttribute("class", "result-message"); //assign it a class
        nmovesMessage.innerHTML = `You made ${moveCounter} moves`; //text to display. the number of moves is gotten from local storage

        let timeExhaustedMessage = document.createElement('p'); //create a p element for the time exhausted message
        nmovesMessage.setAttribute("class", "result-message"); //assign it a class
        timeExhaustedMessage.innerHTML = `Time Exhausted ${strnMins}:${strnSecs}`; //text to display. The value is computed from local storage but stored as strings in those variables

        let trophyArea = document.createElement('div'); //create a div to hold the trophy image
        trophyArea.setAttribute("class", "trophy-area"); //assign it a class

        resultScoresPage.appendChild(youWonMessage); //append the you won message to the result score div
        resultScoresPage.appendChild(starRatingMessage); //append the star rating message to the result score div
        resultScoresPage.appendChild(nmovesMessage); //append the number of moves message to the result score div
        resultScoresPage.appendChild(timeExhaustedMessage); //append the time exhausted message to the result score div
        modalBodyContent.appendChild(resultScoresPage); //append the results score div to the modal body content div
        modalBodyContent.appendChild(trophyArea); //append also the trophy area div to the modal body content div
        modalBody.appendChild(modalBodyContent); //append the modal body content div to the modal body div
    }
    modalContent.appendChild(modalBody); //finally append the modal body div inside the wrapper for modal contents
    
    //Dynamic Modal Footer Information
    let gameInstructions = document.createElement('a'); //create an a element for the game instructions
    //if game is just starting, display game instruction with an arrow down icon and listen for click events on it
    if(localStorage.gameState === 'toStart'){
        gameInstructions.setAttribute("href", "#"); //disable href attribute
        gameInstructions.setAttribute("class", "game-instructions"); //assign it a class
        gameInstructions.setAttribute("onClick", "makeInstructions()"); //add a click event listener to make the instruction to display
        gameInstructions.innerHTML = "Game Instructions "; //text to display

        let arrowBtn = document.createElement('i'); //create an i element, to display an icon of an arrow pointing down.
        arrowBtn.setAttribute("class", "fas fa-chevron-circle-down"); //assign it these classes to make it show
        gameInstructions.appendChild(arrowBtn); //append the arrow icon to the game instructions a tag        
        modalFooter.appendChild(gameInstructions); //append the game instructions a tag to the modal footer
    }
    //if the user has successfully completed the game, display try again with a repeat icon
    if(localStorage.gameState === 'win'){
        gameInstructions.setAttribute("href", "#"); //disable href attribute
        gameInstructions.setAttribute("class", "play-again"); //assign it a class
        gameInstructions.setAttribute("onClick", "playAgain()"); //assign it a click event listener that call the playAgain function that resets the game but preserves the player name
        gameInstructions.innerHTML = " Play Again"; //text to display

        let arrowBtn = document.createElement('i'); //create an i element to display a repeat icon
        arrowBtn.setAttribute("class", "fa fa-repeat"); //assign it these classes to make it show
        gameInstructions.appendChild(arrowBtn); //append the repeat icon to the play again a tag
        modalFooter.appendChild(gameInstructions); //append the game instructions a tag to the modal footer
    }
    //fixed modal footer copyright information
    let copyRight = document.createElement('span'); //create a span element for the copyright info
    copyRight.setAttribute("class", "copy-right"); //assign it a class
    copyRight.innerHTML = "&copy; 2018 Johnleonard U.C."; //text to display

    modalFooter.appendChild(copyRight); //append copyright information to the modal footer
    modalContent.appendChild(modalFooter); //append the modal footer info to the modal content or the wrapper for modal contents 
    modalContainer.appendChild(modalContent); //append modal contents to its container div
    document.body.appendChild(modalContainer); //finally append the modal container to the document body
}

//function that creates the game instuctions for the user
function makeInstructions(){
    let instructionsCard = document.createElement('section'); //create a section element for the instructions
    //if it is the first time the game instructions text with down arrow is clicked, make the istructions
    if(localStorage.instructionState === '1'){
        instructionsCard.setAttribute("class", "instructions-card"); //assign it a class

        let instructionsHead = document.createElement('h3'); //heading (h3 element) text for the instructions
        instructionsHead.setAttribute("class", "instructions-txt"); //assign it a class
        instructionsHead.innerText = "INSTRUCTIONS"; //text to display
        instructionsCard.appendChild(instructionsHead); //append the heading text to the instructions section

        let instructionsTxt = document.createElement('ul'); //create an unordered list element for the instructions
        instructionsTxt.setAttribute("class", "instructions-txt"); //assign it a class
        let instructionsTxtList1 = document.createElement('li'); //create a list element
        instructionsTxtList1.innerText = "After filling your name and clicking on the Play button, the game starts"; //text to display
        instructionsTxt.appendChild(instructionsTxtList1); //append it to the unordered list
        let instructionsTxtList2 = document.createElement('li'); //create a list element
        instructionsTxtList2.innerText = "The game consists of a deck of 16 cards (8 pairs). You are expected to flip the cards until you match all"; //text to display
        instructionsTxt.appendChild(instructionsTxtList2); //append it to the unordered list
        let instructionsTxtList3 = document.createElement('li'); //create a list element
        instructionsTxtList3.innerText = "To flip a card, click on any cell. Click on another to check if it matches."; //text to display
        instructionsTxt.appendChild(instructionsTxtList3); //append it to the unordered list
        let instructionsTxtList4 = document.createElement('li'); //create a list element
        instructionsTxtList4.innerText = "Watch out for the timer, star rating, and moves. All the best. Enjoy!!"; //text to display
        instructionsTxt.appendChild(instructionsTxtList4); //append it to the unordered list

        instructionsCard.appendChild(instructionsTxt); //append the instructions info to the instructions section
        document.querySelector('.modal-content').appendChild(instructionsCard); //append the instructions section to the already existing modal content

        localStorage.instructionState ++; //increment the instruction state in local storage to show that it was clicked
    }
    //if it is the second time the game instructions text with down arrow is clicked, remove the istructions
    else if(localStorage.instructionState === '2'){
        document.querySelector('.instructions-card').remove(); //gets the instructions and removes them at once
        localStorage.instructionState --; //decrement the instruction state in local storage.
    }
}

//this function is responsible for processing the player name keyed-in by the user
function inputProcessor(){
    let inputtedName = document.querySelector('.text-area').value; //gets the player name from the form
    localStorage.setItem("player", inputtedName); //stores the player name in local storage
        //if the user did not type in anything, shake the text field, display a red border on the form, and focus the cursor on the form
        if(localStorage.player === ''){
            let redTexfield = document.querySelector('.text-area'); //gets the text field
            redTexfield.classList.add('red-border'); //adds the red border class to the text input field
            redTexfield.classList.add('shake'); //adds the shake class to the text field and hence shaking it
            document.querySelector("input").focus(); //focus the cursor on the form
        }
        //if the user typed in something, remove the modal totally and cause the trigger the game to start
        else {
            let getModalContainer = document.querySelector('.modal-container'); //get the modal container
            document.body.removeChild(getModalContainer); //remove it from the pages' body
            gameStart(); //trigger game to start
        }
}

//this function initilizes and begins the game
function gameStart(){
    initPlayerName(); //initializes the player name
    initRatingSys(); //initializes the rating system
    fnMoveCounter(); //initializes the moves counter
    dispTimer(); //displays the timer
    callTimer(); //triggers the timer to start running
}

//this function initializes the player name by getting it from local storage and displaying it on the page
function initPlayerName(){
    let playerId = document.querySelector('#player-name'); //get the player name part of the leaderboard
    playerId.innerHTML = `Player: ${localStorage.getItem('player')}`; //fetch the plyer name from local storage and display it
}

//this function initializes the rating system
function initRatingSys(){
    let stars = document.querySelectorAll('.fa-star'); //get the stars list items from page
    localStorage.rating = '3/3 - Professional'; //ensure the rating begins with 3/3 star rating
    //add the rating class to each of the stars list so as to apply adequate styles to it
    for(let i=0; i<stars.length; i++){
        stars[i].classList.add('rating');
    }
}

//this function initializes the move counter and displays appropriate text singular/plural.
function fnMoveCounter(){
    let moveCountContainer = document.querySelector('.moves'); //get the moves part of the leaderboard
    if(moveCounter >1){
        moveCountContainer.innerText = `${moveCounter} Moves`; //when moves is more than one, use plural 'moves'
    }
    else{
        moveCountContainer.innerText = `${moveCounter} Move`; //when moves is 1 or 0, use singular 'move'
    }
}

//this function is responsible for displaying the timer correctly. It gets values from localstorage, converts them to string, and then formats the display 
function dispTimer(){
    strnSecs = (localStorage.seconds < 10) ? `0${localStorage.seconds.toString()}` : localStorage.seconds.toString(); //for seconds
    strnMins = (localStorage.minutes < 10) ? `0${localStorage.minutes.toString()}` : localStorage.minutes.toString(); //for minutes
    gameTimer.innerText = `${strnMins}:${strnSecs}`; //formats display
}

//this function initiates the timing routine
function callTimer(){
    timerId = setInterval(upcounter, 1000); //call upcounter every one second
}

//this function is responsible for clocking the timer
function upcounter(){
    localStorage.seconds ++; //increment the seconds variable in local storage
    //if value in seconds variable is greater than 59, increment minutes and reset seconds to 0.
    if(localStorage.seconds > 59){
        localStorage.minutes ++;
        localStorage.seconds = 0;
    }
    dispTimer(); //call dispTimer function to format the display of the timer on the leaderboard
}

//this function increments the moves counter variable
function incrMoveCounter(){
    moveCounter +=1; //increment move counter
    fnMoveCounter(); //call this to display the current moves
    ratingSys() //checks and/or modifies the star rating since it is dependent on it
}

//this function modifies the star rating. It is responsible for computing the current star rating to display
function ratingSys(){
    let stars = document.querySelectorAll('.fa-star'); //gets the stars from the leaderboard
    //for each of the stars, do the following(3 conditions)
    for(let i=0; i<stars.length; i++){
        //condition 1, when the user has made moves that is within 8 and 16
        if(moveCounter >= 8 && moveCounter <= 16 && i==2){
            localStorage.rating = '2/3 - Intermediate'; //give it 2/3 rating in local storage
            stars[i].classList.remove('rating'); //modify the star display to remain 2
        }
        //condition 2, when the user has made moves that is greater than 20
        else if(moveCounter > 20 && i==1){
            localStorage.rating = '1/3 - Beginner'; //give it 1/3 rating in local storage
            stars[i].classList.remove('rating'); //modify the star display to remain 1
        }
        //condition 3, when the user has made moves that is greater than 32
        else if(moveCounter > 32 && i==2){
            localStorage.rating = '0/3 - Novice'; ////give it 1/3 rating in local storage
            stars[i].classList.remove('rating'); //modify the star display to remain 0
        }
    }
}

//Function that resets the game when the user clicks on Play again.
function playAgain(){
    let getModalContainer = document.querySelector('.modal-container'); //gets the modal container
    document.body.removeChild(getModalContainer); //removes it totally from the screen
    resetGame(); //calls the reset game function
}

//this function resets various parameters of the game
function resetGame(){
    clearLocalStorage(); //
    document.querySelector('.deck').remove(); //removes the current deck of cards
    makeCardDeck(); //makes a fresh deck of cards
    moveCounter = 0; //resets the move counter variable
    cardsMatchCounter = 0; //resets the cards match counter variable
    fnMoveCounter(); //displays the current moves
    initRatingSys(); //initializes the rating system
    clearTimer(); //resets timer values
    callTimer(); //triggers the timer to start counting
}

//removes the clicked cards tracked in local storage
function clearLocalStorage(){
    localStorage.removeItem('clickedCard1');
    localStorage.removeItem('clickedCard2');
}

//this function clears all timer values
function clearTimer(){
    clearInterval(timerId); //stop timer
    localStorage.seconds = 0; //clear seconds in local storage
    localStorage.minutes = 0; //clear minutes in local storage
    dispTimer(); //display the current time on the leaderboard
}

//this function is responsible for opening the clicked cards
function openClickedCard(e){
    e.target.className = localStorage.openCard; //assign it a class that make it look opened
    counter +=1; //increment counter to keep track of how many cards are open
};

//this function is responsible for saving any card that is clicked
function saveClickedCard(e){
    localStorage.setItem(`clickedCard${counter}`, e.target.innerHTML);
}

//this function shows cards that match
function showCardsMatch(){
    let match = document.querySelectorAll('.show'); //gets all opened cards
    for(let i=0; i<match.length; i++){
        match[i].className = localStorage.cardsMatch; //for each of them, add to it a class that will distinguish them as matched cards
    }
    cardsMatchCounter +=1; //increment cardsMatchCounter to track the number of times cards matched
}

//this function closes back cards that do not match. they close after 1 second
function closeCardsDontMatch(){
    let notMatch = document.querySelectorAll('.show'); //get all opened cards
    setTimeout(function () {
        for(let i=0; i<notMatch.length; i++){
            notMatch[i].className = localStorage.closeCard; //for each of them, in one second, add to it a class that will distinguish them as closed cards
        }
    }, 1000);
}

//event listener on the game container div, to listen for clicks on cards
document.querySelector('.container').addEventListener('click', function(e){
    //If a card is clicked:
    if(e.target.className === 'card'){
        //display the card's symbol
        openClickedCard(e);
        //add the card to a *list* of "open" cards
        saveClickedCard(e);
    // if the list already has another card, check to see if the two cards match
        if(counter === 2 && localStorage.clickedCard1 === localStorage.clickedCard2){
            //if the cards do match, lock the cards in the open position
            showCardsMatch();
            //spin for 2 seconds
            let match = document.querySelectorAll('.fa-spin'); 
            setTimeout(function(){
                for(let i=0; i<match.length; i++){
                    match[i].classList.remove('fa-spin');
                }
            }, 2000);

            counter = 0; //reset counter
            incrMoveCounter(); //increment moves
            
    // if all cards have matched, display a message with the final score
            if(cardsMatchCounter === 8){
                localStorage.gameState = 'win'; //set the game state in local storage to win
                //display modal after 1 second of win
                setTimeout(function(){
                    makeModalStruct(); //makes the win modal
                    clearTimer(); //resets the timer
                }, 1000);
            }
        };
    //if the cards do not match, remove the cards from the list and hide the card's symbol
        if(counter === 2 && localStorage.clickedCard1 !== localStorage.clickedCard2){
            let notMatch = document.querySelectorAll('.show'); //get the open cards
            for(let i=0; i<notMatch.length; i++){
                notMatch[i].classList.add('shake'); //shake both of them
            }
            closeCardsDontMatch() //close the cards
            clearLocalStorage() //clears the local storage info about cicked cards
            counter = 0; //reset the counter
            //increment the move counter and display it on the page (put this functionality in another function that you call from this one)
            incrMoveCounter(); //increment the moves
        }
    };

    //if the clicked part is the restart div, reset game
    if(e.target.className === 'restart'){
        resetGame(); //calls the resetGame function
    }
});

makeModalStruct(); //creates the modal
document.querySelector("input").focus(); //makes the input in the modal to be automatically focused on, ie, with a blinking cursor 
makeCardDeck(); //creates the deck of cards
