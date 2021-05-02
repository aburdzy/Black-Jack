let cardsField = document.querySelectorAll('.cards-field');

let playerScore = document.querySelector('.player-score');
let croupierScore = document.querySelector('.croupier-score');

let hit = document.querySelector('.card.hit');
let stand = document.querySelector('.card.stand');

let overlay = document.querySelector('.overlay');
let notification = document.querySelector('.notification');
let resetGame = document.querySelector('.reset-game');

class Game {

    constructor() {
        this.signs = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
        this.values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
        this.colors = ['spades', 'heart', 'club', 'diamond'];

        this.playerCards = [];
        this.croupierCards = [];

        this.playerScore = 0;
        this.croupierScore = 0;

        this.playerOffset = 0;
        this.croupierOffset = 0;

        this.playerRotate = -10;
        this.croupierRotate = -10;

        this.firstCroupierCard = true;
        this.hiddenCard = [];
    };

    showCard(_color, _sign, turn) {
        let color = _color;
        let sign = _sign;
        
        let element = [];
        
        for(let i = 0; i < 14; i++) {
            element[i] = document.createElement('div');
        }

        cardsField[turn].appendChild(element[0]);

        if(this.firstCroupierCard) {
            this.hiddenCard[0] = element[0]
            element[0].classList.add('card', 'invisible');

            element[0].appendChild(element[1]);
            this.hiddenCard[1] = element[1]
            element[1].classList.add('visibility', 'invisible');
            this.firstCroupierCard = false;
        }
        else {
            element[0].classList.add('card');

            element[0].appendChild(element[1]);
            element[1].classList.add('visibility');
        }

        if(turn == 0) {
            element[0].style.left = this.playerOffset + 'px';
            element[0].style.transform = 'rotate(' + this.playerRotate + 'deg)';
        }
        else {
            element[0].style.left = this.croupierOffset + 'px';
            element[0].style.transform = 'rotate(' + this.croupierRotate + 'deg)';
        }

        element[1].appendChild(element[2]);
        element[2].classList.add('heading', this.colors[color]); 

        element[2].appendChild(element[3]);
        element[3].classList.add('name', this.colors[color]);
        element[3].innerHTML = this.signs[sign];
        
        element[2].appendChild(element[4]);
        element[4].classList.add('color'); 

        element[4].appendChild(element[5]);
        element[5].classList.add('element1', this.colors[color]);

        element[5].appendChild(element[6]);
        element[6].classList.add('element2', this.colors[color]);

        element[5].appendChild(element[7]);
        element[7].classList.add('element3', this.colors[color]);

        element[5].appendChild(element[8]);
        element[8].classList.add('element4', this.colors[color]);

        element[1].appendChild(element[9]);
        element[9].classList.add('color');

        element[9].appendChild(element[10]);
        element[10].classList.add('element1', this.colors[color]);

        element[10].appendChild(element[11]);
        element[11].classList.add('element2', this.colors[color]);

        element[10].appendChild(element[12]);
        element[12].classList.add('element3', this.colors[color]);

        element[10].appendChild(element[13]);
        element[13].classList.add('element4', this.colors[color]);

        if(turn == 0) {
            this.playerOffset += 50;
            this.playerRotate += 10;
        }
        else {
            this.croupierOffset += 50;
            this.croupierRotate += 10;
        }
    }

    dealPlayerCard() {
        if(this.playerScore < 21) {
            let sign = Math.floor(Math.random() * (this.signs.length - 1));
            let color = Math.floor(Math.random() * (this.colors.length - 1));

            this.showCard(color, sign, 0);

            return this.playerCards.push({
                cardSign:  this.signs[sign],
                cardColor: this.colors[color],
                cardValue: this.values[sign]
            });  
        }
    }

    dealCroupierCard() {
        let sign = Math.floor(Math.random() * (this.signs.length - 1));
        let color = Math.floor(Math.random() * (this.colors.length - 1));

        this.showCard(color, sign, 1);

        return this.croupierCards.push({
            cardSign:  this.signs[sign],
            cardColor: this.colors[color],
            cardValue: this.values[sign]
        });
    }

    countPlayerScore() {
        this.playerScore = 0;

        for(let card of this.playerCards) {
            this.playerScore += card.cardValue;
        }

        playerScore.innerHTML = 'Player: ' + this.playerScore;

        return this.playerScore;
    }

    countSecondCroupierCardScore() {
        croupierScore.innerHTML = 'Croupier: ' + this.croupierCards[1].cardValue;
    }

    countCroupierScore() {
        this.croupierScore = 0;

        for(let card of this.croupierCards) {
            this.croupierScore += card.cardValue;
        }

        croupierScore.innerHTML = 'Croupier: ' + this.croupierScore;

        return this.croupierScore;
    }

    checkBlackJack() {
        if(this.playerScore == 21) {
            this.showResults('Your Black Jack!');
            this.gameOver();

            while(this.croupierScore <= 16) {
                this.dealCroupierCard();
                this.countCroupierScore();
            }

            if(this.playerScore == 21 && this.croupierScore == 21) {
                this.showResults('Two Black Jack - draw!');
                this.gameOver();
            }

            this.hiddenCard[0].classList.remove('invisible');
            this.hiddenCard[1].classList.remove('invisible');
        }
        else if(this.croupierScore == 21) {
            this.showResults('Croupier Black Jack!');
            this.gameOver();

            this.hiddenCard[0].classList.remove('invisible');
            this.hiddenCard[1].classList.remove('invisible');
        }
    }

    showResults(result) {
        notification.innerHTML = result;
    }

    gameOver() {
        overlay.classList.remove('invisible');
        overlay.classList.add('visible');
    }

    resetGame() {
        location.href = location.href;
    }
};

window.addEventListener('load', () => {
    function playerHit() {
        game.dealPlayerCard();
        game.countPlayerScore();
    
        if(game.playerScore > 21) {
            game.showResults('You lost!');
            game.gameOver();
    
            game.hiddenCard[0].classList.remove('invisible');
            game.hiddenCard[1].classList.remove('invisible');
        }
            game.checkBlackJack();
    }
    
    function playerStand() {
        while(game.croupierScore <= 16) {
            game.dealCroupierCard();
            game.countCroupierScore();
            game.checkBlackJack();
        }
        
        game.hiddenCard[0].classList.remove('invisible');
        game.hiddenCard[1].classList.remove('invisible');
        
        if(game.croupierScore > 21) {
            game.showResults('You win!');
            game.gameOver();
        }
        
        if(game.playerScore < 21 && game.croupierScore < 21 && game.playerScore - game.croupierScore > 0) {
            game.showResults('You win!');
            game.gameOver();
        }
        else if(game.playerScore < 21 && game.croupierScore < 21 && game.playerScore - game.croupierScore < 0) {
            game.showResults('You lost!');
            game.gameOver();
        }
        else if(game.playerScore < 21 && game.croupierScore < 21 && game.playerScore == game.croupierScore) {
            game.showResults('Draw!');
            game.gameOver();
        }
    }

    let game = new Game();

    game.dealCroupierCard();
    game.dealCroupierCard();
    game.countSecondCroupierCardScore();

    game.dealPlayerCard();
    game.dealPlayerCard();
    game.countPlayerScore();
    game.checkBlackJack();

    hit.addEventListener('click', playerHit);
    stand.addEventListener('click', playerStand);
    resetGame.addEventListener('click', game.resetGame);
});




