var dealerHand = [];
var playerHand = [];


// Card Class Definition
class Card{
    constructor(points, suit){
        this.points = points
        this.suit = suit
    }

    getImageUrl = function(){
        var sundry = this.points;
    
        if (this.points === 1)  {sundry = 'A';}
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

        for (let points = 1; points < 14; points++) {
            var suits = ['C', 'D', 'H', 'S'];
            for (const suit in suits) {
                this.deck.push(new Card(points, suits[suit]))
            }
        }
    }
}

// Create a new Deck and Shuffle it

var deckObj = new Deck();

deck = _.shuffle(deckObj.deck)

console.log(deck);
console.log(deck[0]);

console.log(deck[0].getImageUrl());

dealer_hand = document.querySelector('#dealer-hand')
dealer_hand.innerHTML += deck[0].getImageUrl()
