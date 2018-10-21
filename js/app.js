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
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
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


function makeModalStruct(){
    let modalHeader = document.createElement('header');
    let modalBody = document.createElement('div');
    let modalFooter = document.createElement('footer');

    let modalContainer = document.createElement('div');
    modalContainer.className = "modal-container";
           //make modal contents
    let modalContent = document.createElement('div');
    modalContent.className = "modal-content";
    modalContainer.appendChild(modalContent);
            //make modal header
    modalHeader.className = "modal-header";

    let modalHeaderEl = document.createElement('h1');
    if(localStorage.gameState === 'toStart'){
        modalHeaderEl.innerText = "Matching Game";
        modalHeader.appendChild(modalHeaderEl);
    }

    if(localStorage.gameState === 'win'){
        modalHeaderEl.innerHTML = ` Congratulations ${localStorage.getItem('player')}`;
        modalHeader.appendChild(modalHeaderEl);
    }


    modalContent.appendChild(modalHeader);
            //make modal body
   
    modalBody.className = "modal-body";
    
    if(localStorage.gameState === 'toStart'){
        let modalBodyContent = document.createElement('div');
        modalBodyContent.setAttribute("class", "modal-body-area-toStart");

        let formArea = document.createElement('div');
        formArea.setAttribute("class", "form-area");

        let userdata = document.createElement('form');

        let nameLabel = document.createElement('label');
        nameLabel.innerHTML = "Enter your name to play: ";
        nameLabel.setAttribute("class", "name-text");
        userdata.appendChild(nameLabel);
        
        let nameInputEl = document.createElement('input');
        nameInputEl.setAttribute("type", "text");
        nameInputEl.setAttribute("maxlength", "10");
        nameInputEl.setAttribute("name", "player");
        nameInputEl.setAttribute("class", "text-area");
        nameInputEl.setAttribute("placeholder", "Your Name Here");
        nameInputEl.addEventListener('keypress', function (e) {
            if (13 == e.keyCode) {
                inputProcessor();
                //stop enter key from submitting to server
                e.preventDefault();
            }
          });
        
        userdata.appendChild(nameInputEl);
        formArea.appendChild(userdata);

        modalBodyContent.appendChild(formArea);


        let playButttonArea = document.createElement('div');
        playButttonArea.setAttribute("class", "play-buttton-Area");

        let gamePadImg = document.createElement('i');
        gamePadImg.setAttribute("class", "fas fa-gamepad icon-large fa-spin");
        
        gamePadImg.addEventListener('click', function(){
            inputProcessor();
        });
        gamePadImg.addEventListener('mouseenter', function(){
            document.querySelector('.fa-gamepad').classList.remove('fa-spin');
        });
        gamePadImg.addEventListener('mouseleave', function(){
            document.querySelector('.fa-gamepad').classList.add('fa-spin');
        });

        playButttonArea.appendChild(gamePadImg);

        let brText = document.createElement('br');
        playButttonArea.appendChild(brText);

        let playText = document.createElement('span');
        playText.setAttribute("class", "play-text");
        playText.innerText = "Play"
        playButttonArea.appendChild(playText);

        modalBodyContent.appendChild(playButttonArea);

        modalBody.appendChild(modalBodyContent);
    }
    
    if(localStorage.gameState === 'win'){
        let modalBodyContent = document.createElement('div');
        modalBodyContent.setAttribute("class", "modal-body-area-win");

        let resultScoresPage = document.createElement('div');
        resultScoresPage.setAttribute("class", "result-scores-area");

        let youWonMessage = document.createElement('p');
        youWonMessage.setAttribute("class", "you-won-mesage");
        youWonMessage.innerHTML = "You Won !!!";

        let starRatingMessage = document.createElement('p');
        starRatingMessage.setAttribute("class", "result-message");
        starRatingMessage.innerHTML = `Your Star rating was ${localStorage.rating}`;

        let nmovesMessage = document.createElement('p');
        nmovesMessage.setAttribute("class", "result-message");
        nmovesMessage.innerHTML = `You made ${moveCounter} moves`;

        let timeExhaustedMessage = document.createElement('p');
        nmovesMessage.setAttribute("class", "result-message");
        timeExhaustedMessage.innerHTML = `Time Exhausted ${strnMins}:${strnSecs}`;


        let trophyArea = document.createElement('div');
        trophyArea.setAttribute("class", "trophy-area");

        resultScoresPage.appendChild(youWonMessage);
        resultScoresPage.appendChild(starRatingMessage);
        resultScoresPage.appendChild(nmovesMessage);
        resultScoresPage.appendChild(timeExhaustedMessage);

        modalBodyContent.appendChild(resultScoresPage);
        modalBodyContent.appendChild(trophyArea);
        modalBody.appendChild(modalBodyContent);

    }

    modalContent.appendChild(modalBody);
            //make modal footer

    modalFooter.className = "modal-footer";

    let gameInstructions = document.createElement('a');

    if(localStorage.gameState === 'toStart'){
        gameInstructions.setAttribute("href", "#");
        gameInstructions.setAttribute("class", "game-instructions");
        gameInstructions.setAttribute("onClick", "makeInstructions()");
        gameInstructions.innerHTML = "Game Instructions ";

        let arrowBtn = document.createElement('i');
        arrowBtn.setAttribute("class", "fas fa-chevron-circle-down");
        gameInstructions.appendChild(arrowBtn);
        
        modalFooter.appendChild(gameInstructions);
    }

    if(localStorage.gameState === 'win'){
        gameInstructions.setAttribute("href", "#");
        gameInstructions.setAttribute("class", "play-again");
        gameInstructions.setAttribute("onClick", "playAgain()");
        gameInstructions.innerHTML = " Play Again";

        let arrowBtn = document.createElement('i');
        arrowBtn.setAttribute("class", "fa fa-repeat");
        gameInstructions.appendChild(arrowBtn);

        modalFooter.appendChild(gameInstructions);
    }
    let copyRight = document.createElement('span');
    copyRight.setAttribute("class", "copy-right");
    copyRight.innerHTML = "&copy; 2018 Johnleonard U.C.";
    modalFooter.appendChild(copyRight);

    modalContent.appendChild(modalFooter);
    document.body.appendChild(modalContainer);
};

function playAgain(){
    let getModalContainer = document.querySelector('.modal-container');
    document.body.removeChild(getModalContainer);
    resetGame();
};

function inputProcessor(){
    let inputtedName = document.querySelector('.text-area').value;
    localStorage.setItem("player", inputtedName);
        if(localStorage.player === ''){
            let redTexfield = document.querySelector('.text-area');
            redTexfield.classList.add('red-border');
            redTexfield.classList.add('shake');
            document.querySelector("input").focus();
        }else{
            let getModalContainer = document.querySelector('.modal-container');
            document.body.removeChild(getModalContainer);
            gameStart();
        }
}

function makeInstructions(){
    let instructionsCard = document.createElement('section');

    if(localStorage.instructionState === '1'){
        instructionsCard.setAttribute("class", "instructions-card");

        let instructionsHead = document.createElement('h3');
        instructionsHead.setAttribute("class", "instructions-txt");
        instructionsHead.innerText = "INSTRUCTIONS";
        instructionsCard.appendChild(instructionsHead);

        let instructionsTxt = document.createElement('ul');
        instructionsTxt.setAttribute("class", "instructions-txt");
        let instructionsTxtList1 = document.createElement('li');
        instructionsTxtList1.innerText = "After filling your name and clicking on the Play button, the game starts";
        instructionsTxt.appendChild(instructionsTxtList1);
        let instructionsTxtList2 = document.createElement('li');
        instructionsTxtList2.innerText = "The game consists of a deck of 16 cards (8 pairs). You are expected to flip the cards until you match all";
        instructionsTxt.appendChild(instructionsTxtList2);
        let instructionsTxtList3 = document.createElement('li');
        instructionsTxtList3.innerText = "To flip a card, click on any cell. Click on another to check if it matches.";
        instructionsTxt.appendChild(instructionsTxtList3);
        let instructionsTxtList4 = document.createElement('li');
        instructionsTxtList4.innerText = "Watch out for the timer, star rating, and moves. All the best. Enjoy!!";
        instructionsTxt.appendChild(instructionsTxtList4);

        instructionsCard.appendChild(instructionsTxt);
        document.querySelector('.modal-content').appendChild(instructionsCard);

        localStorage.instructionState ++;
    }
    else if(localStorage.instructionState === '2'){
        document.querySelector('.instructions-card').remove();
        localStorage.instructionState --;
    }
}

/*
 * Create a list that holds all of your cards
 */

function makeCardDeck(){
    //Create array to hold the 8 card pairs.
    const cards = [
        "fa-diamond", "fa-diamond",
        "fa-paper-plane-o", "fa-paper-plane-o",
        "fa-anchor", "fa-anchor",
        "fa-bolt", "fa-bolt",
        "fa-cube", "fa-cube",
        "fa-leaf", "fa-leaf",
        "fa-bicycle", "fa-bicycle",
        "fa-bomb", "fa-bomb"
    ];
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
};

function initPlayerName(){
    let playerId = document.querySelector('#player-name');
    playerId.innerHTML = `Player: ${localStorage.getItem('player')}`;
};

function gameStart(){
    initPlayerName();
    initRatingSys();
    fnMoveCounter();
    dispTimer();
    callTimer();
};

function initRatingSys(){
    let stars = document.querySelectorAll('.fa-star');
    localStorage.rating = '3/3 - Professional';
    for(let i=0; i<stars.length; i++){
        stars[i].classList.add('rating');
    }
}
// set up the event listener for a card. 
localStorage.setItem("openCard", "card open show");
localStorage.setItem("closeCard", "card");
localStorage.setItem("cardsMatch", "card open match fa-spin");
let moveCounter = 0;
let cardsMatchCounter = 0;
let gameTimer = document.querySelector('.timer');
localStorage.setItem("seconds", 0);
localStorage.setItem("minutes", 0);
localStorage.setItem("gameState", "toStart");
let counter = 0;
var timerId;
localStorage.setItem("instructionState", 1);
localStorage.setItem("rating", "3/3 - Professional");
let strnMins ="";
let strnSecs ="";

makeModalStruct();
makeCardDeck();

function callTimer(){
    timerId = setInterval(upcounter, 1000);
}


function dispTimer(){
    strnSecs = (localStorage.seconds < 10) ? `0${localStorage.seconds.toString()}` : localStorage.seconds.toString();
    strnMins = (localStorage.minutes < 10) ? `0${localStorage.minutes.toString()}` : localStorage.minutes.toString();
    gameTimer.innerText = `${strnMins}:${strnSecs}`;
}

function upcounter(){
    localStorage.seconds ++;
    if(localStorage.seconds > 59){
        localStorage.minutes ++;
        localStorage.seconds = 0;
    }
    dispTimer();
};

function clearTimer(){
    clearInterval(timerId);
    localStorage.seconds = 0;
    localStorage.minutes = 0;
    dispTimer();
};

function fnMoveCounter(){
    let moveCountContainer = document.querySelector('.moves');
    if(moveCounter >1){
        moveCountContainer.innerText = `${moveCounter} Moves`;
    }
    else{
        moveCountContainer.innerText = `${moveCounter} Move`;
    }
};

function openClickedCard(e){
    e.target.className = localStorage.openCard;
    counter +=1;
};

function saveClickedCard(e){
    localStorage.setItem(`clickedCard${counter}`, e.target.innerHTML);
};

function showCardsMatch(){
    let match = document.querySelectorAll('.show');
    for(let i=0; i<match.length; i++){
        match[i].className = localStorage.cardsMatch;
    }
    //increment cardsMatchCounter to track the number of times cards matched
    cardsMatchCounter +=1;
};

function closeCardsDontMatch(){
    let notMatch = document.querySelectorAll('.show');
    setTimeout(function () {
        for(let i=0; i<notMatch.length; i++){
            notMatch[i].className = localStorage.closeCard;
        }
    }, 1000);
};

function clearLocalStorage(){
    localStorage.removeItem('clickedCard1');
    localStorage.removeItem('clickedCard2');
}
function ratingSys(){
    let stars = document.querySelectorAll('.fa-star');
    for(let i=0; i<stars.length; i++){
        if(moveCounter >= 8 && moveCounter <= 16 && i==2){
            localStorage.rating = '2/3 - Intermediate';
            stars[i].classList.remove('rating');
        }
        else if(moveCounter > 20 && i==1){
            stars[i].classList.remove('rating');
            localStorage.rating = '1/3 - Beginner';
        }
        else if(moveCounter > 32 && i==2){
            stars[i].classList.remove('rating');
            localStorage.rating = '0/3 - Novice';
        }
    }
}

function incrMoveCounter(){
    moveCounter +=1;
    fnMoveCounter();
    ratingSys()
};

function resetGame(){
    clearLocalStorage();
    document.querySelector('.deck').remove();
    makeCardDeck();
    moveCounter = 0;
    cardsMatchCounter = 0;
    fnMoveCounter();
    initRatingSys();
    clearTimer();
    callTimer();
}

document.querySelector("input").focus();

document.querySelector('.container').addEventListener('click', function(e){
    //If a card is clicked:
    if(e.target.className === 'card'){
        //display the card's symbol (put this functionality in another function that you call from this one)
        openClickedCard(e);
        //add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
        saveClickedCard(e);
    // if the list already has another card, check to see if the two cards match
        if(counter === 2 && localStorage.clickedCard1 === localStorage.clickedCard2){
            //if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
            showCardsMatch();
            let match = document.querySelectorAll('.fa-spin');
            setTimeout(function(){
                for(let i=0; i<match.length; i++){
                    match[i].classList.remove('fa-spin');
                }
            }, 2000);

            counter = 0;
            incrMoveCounter();
            
    // if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
            if(cardsMatchCounter === 8){
                localStorage.gameState = 'win';
                setTimeout(function(){
                    makeModalStruct();
                    clearTimer();
                }, 1000);
            }
        };
    //if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
        if(counter === 2 && localStorage.clickedCard1 !== localStorage.clickedCard2){
            let notMatch = document.querySelectorAll('.show');
            for(let i=0; i<notMatch.length; i++){
                notMatch[i].classList.add('shake');
            }
            closeCardsDontMatch()
            clearLocalStorage()
            counter = 0;
            //increment the move counter and display it on the page (put this functionality in another function that you call from this one)
            incrMoveCounter();
        }
    };

    if(e.target.className === 'restart'){
        resetGame();
    }
});
