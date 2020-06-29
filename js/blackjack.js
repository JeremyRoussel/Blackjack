// DOM Elements

dealer_hand_location = document.querySelector('#dealer-hand')
player_hand_location = document.querySelector('#player-hand')
dealer_hand_points_loc = document.querySelector('#dealer-label')
player_hand_points_loc = document.querySelector('#player-label')
bet_loc = document.querySelector('#bet')
pot_loc = document.querySelector('#pot')
messages_loc = document.querySelector('#messages')


// Variables

var gameState = "reset"
var money = 500;
var bet = 0;
var cardBack = '<img src="img/purple_back.jpg">'

// Create Class for Hands

class Hands{
    constructor(){
        this.total = 0
        this.cards = []
        this.cardPoints = []
        this.sortPoints = []
    }
    updater = function(){
        // Reset totals
        this.total = 0
        this.sortPoints = []
        this.cardPoints = []

        // Sort cards by value to handle aces correctly
        for (let i = 0; i < this.cards.length; i++) {
            this.cardPoints.push(this.cards[i].points)
        }
        this.sortPoints = this.cardPoints.sort((a,b) => a - b)
        
        // Add point values together
        for (const key in this.sortPoints) {
            switch (this.sortPoints[key]) {
                case 14:
                    if (this.total <= 10){
                        this.total += 11
                    }
                    else {
                        this.total += 1
                    }
                    break;
                
                case 11:
                case 12:
                case 13:
                    this.total += 10
                    break;
                
                default:
                    this.total += parseInt(this.sortPoints[key])
                    break;
            }

        }
        var totalpoints = this.total
        return totalpoints
    };
}


// Create Hands objects

var dealerHand = new Hands()
var playerHand = new Hands()


// Card Class Definition

class Card{
    constructor(points, suit){
        this.points = points
        this.suit = suit
    }

    getImageUrl = function(){
        var sundry = this.points;
    
        if (this.points === 14)  {sundry = 'A';}
        if (this.points === 11) {sundry= 'J';}
        if (this.points === 12) {sundry = 'Q';}
        if (this.points === 13) {sundry = 'K';}
    
        return '<img src="img/' + sundry + this.suit + '.jpg">';
    };
}


// Deck Class Definition

class Deck{
    constructor(){
        this.deck = [];

        for (let points = 2; points < 15; points++) {
            var suits = ['C', 'D', 'H', 'S'];
            for (const suit in suits) {
                this.deck.push(new Card(points, suits[suit]))
            }
        }
    }
}

// Update Board State

function stateUpdater(){

    // Reset card and point displays

    dealer_hand_location.innerHTML = ""
    player_hand_location.innerHTML = ""
    dealer_hand_points_loc.innerHTML = "Dealer: "
    player_hand_points_loc.innerHTML = "Player: "
    
    // Dealer Display
    // If player is active, hide dealer first card and points
    if (gameState != "end"){
        dealer_hand_location.innerHTML += cardBack
        dealer_hand_location.innerHTML += dealerHand.cards[1].getImageUrl()
        var dealer_points = 0;
    }
    // Player Inactive
    if (gameState == "end"){
        for (let i = 0; i < dealerHand.cards.length; i++) {
            dealer_hand_location.innerHTML += dealerHand.cards[i].getImageUrl()
        }
        var dealer_points = dealerHand.updater()
    }

    // Player Display
    for (let i = 0; i < playerHand.cards.length; i++) {
        player_hand_location.innerHTML += playerHand.cards[i].getImageUrl()
    }

    var player_points = playerHand.updater()

    dealer_hand_points_loc.innerHTML += dealer_points.toString()
    player_hand_points_loc.innerHTML += player_points.toString()

}

function betUpdater(){
    // Money Displays
    bet_loc.innerHTML = "$" + bet.toString()
    pot_loc.innerHTML = "$" + money.toString()
}

// Create a new Deck and Shuffle it

function newDeck(){
    var deckObj = new Deck();

    return _.shuffle(deckObj.deck)
}

// Deal initial cards

function newDeal(){
    
    // New Deck if less than half full
    if (deck.length < 26){
        deck = newDeck()
    }

    // Empty Hands
    dealerHand.cards = []
    playerHand.cards = []

    // Deal two to each
    dealerHand.cards.push(deck.shift())
    dealerHand.cards.push(deck.shift())

    playerHand.cards.push(deck.shift())
    playerHand.cards.push(deck.shift())
}

// Check condictions

function checkWinners(){
    if (playerHand.total > 21) {
        messages_loc.innerHTML = "<h2>You Busted!</h2>"
        return "Loser!"
    }
    if (dealerHand.total > 21) {
        messages_loc.innerHTML = "<h2>You Win!</h2>"
        return "Winner!"
    }
    if (dealerHand.total > 16 && playerHand.total > dealerHand.total){
        messages_loc.innerHTML = "<h2>You Win!</h2>"
        return "Winner!"
    }
    if (dealerHand.total > 16 && playerHand.total <= dealerHand.total){
        messages_loc.innerHTML = "<h2>You Lost!</h2>"
        return "Loser!"
    }
    else {
        return "Continue"
    }

}


// Init Game

// Create Deck

var deck = newDeck()


// // Update Board State

// stateUpdater()

// Event Listeners

var buttons = document.querySelectorAll('.play')
var chips = document.querySelector('.chips')

// Betting Functions

chips.addEventListener('click', (e) => {
    if (gameState == "reset"){
        var amount = e.target.id
        console.log(amount);
        if (money >= amount){
            money -= amount
            bet += parseInt(amount)
            messages_loc.innerHTML = "<h2>Let's Play!</h2>"
        }
        else{
            messages_loc.innerHTML = "<h2>Not enough money!</h2>"
        }
        betUpdater()
    }

})

buttons.forEach(el => {
    el.addEventListener('click', (e) => {
        
        switch (e.target.id) {
            case "deal-button":
                if (bet > 0 && gameState != "inPlay"){
                    console.log("Deal!");
                    newDeal()
                    gameState = "inPlay"
                    stateUpdater()
                }
                
                break;

            case "hit-button":
                if (bet > 0 && gameState == "inPlay"){
                    console.log("Hit!");
                    playerHand.cards.push(deck.shift())
                    stateUpdater()
                    console.log(checkWinners());
                    const statement = checkWinners()
                    if (statement == "Loser!"){
                        gameState = "end"
                    }
                }
                break;

            case "stand-button":
                if (bet > 0 && gameState == "inPlay"){
                    console.log("Stand!");
                    dealerHand.updater()
                    while (dealerHand.total < 17) {
                        gameState = "end"
                        dealerHand.cards.push(deck.shift())
                        stateUpdater()
                    }
                    if (checkWinners() != "Continue"){
                        gameState = "end"
                    }
                    stateUpdater()
                }
                break;

            case "reset-button":
                if (gameState == "end"){
                    console.log("Resetting!");
                    switch (checkWinners()) {
                        case "Winner!":
                            money += 2*bet
                            console.log("Added!");
                            break;
                        case "Loser!":
                            break;
                        default:
                            console.log("Continue?");
                            break;
                    }
                    gameState = "reset"
                    dealerHand.cards = []
                    dealerHand.total = 0;
                    playerHand.cards = []
                    playerHand.total = 0;
                    bet = 0;
                    dealer_hand_location.innerHTML = ""
                    player_hand_location.innerHTML = ""
                    dealer_hand_points_loc.innerHTML = "Dealer: "
                    player_hand_points_loc.innerHTML = "Player: "
                    messages_loc.innerHTML = "<h2>Play Again?</h2>"
                    betUpdater()
                    statement = ""
                }
                break;

            default:
                break;
        }

    })
    
});
