
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

makeCardDeck();

// set up the event listener for a card. 
localStorage.setItem("openCard", "card open show");
localStorage.setItem("closeCard", "card");
localStorage.setItem("cardsMatch", "card open match");
let moveCounter = 0;
let cardsMatchCounter = 0;
fnMoveCounter();

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

function threeStars(){
    let stars = document.querySelectorAll('.fa-star');
    for(let i=0; i<stars.length; i++){
        stars[i].classList.add('rating');
    }
}

function twoStars(){
    let stars = document.querySelectorAll('.fa-star');
        stars[3].classList.remove('rating');
}


function incrMoveCounter(){
    moveCounter +=1;
    fnMoveCounter();
    let starRating = document.querySelector('.stars');
    if(moveCounter < 8){
        for(let i=0; i<starRating.length; i++){
            starRating[i].classList.add('rating');
        }
    }
    else if(moveCounter < 16){
        stars.lastElementChild.classList.remove('rating');
    }
};

let counter = 0;
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
            counter = 0;
            incrMoveCounter();
            if(cardsMatchCounter === 8){
                console.log(`Congratulations you won. \nYou made ${moveCounter} moves. \nDo you want to play again.`)
            }
        };
    //if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
        if(counter === 2 && localStorage.clickedCard1 !== localStorage.clickedCard2){
            closeCardsDontMatch()
            clearLocalStorage()
            counter = 0;
            //increment the move counter and display it on the page (put this functionality in another function that you call from this one)
            incrMoveCounter();
        }
    };

    if(e.target.className === 'fa fa-repeat'){
        clearLocalStorage();
        let container = document.querySelector('.container');
        container.removeChild(document.querySelector('.deck'));
        makeCardDeck();
        moveCounter = 0;
        cardsMatchCounter = 0;
        fnMoveCounter();
    }
});

/*    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

