import { maxBy } from "../../lib/collections";

class Player {
    score = 0;
}

class Game {
    public readonly players: Player[] = [];
    public currentPlayerIndex = 0;
    public marbles = [0];
    public currentMarbleIndex = 0;
    public lowestRemainingMarble = 1;

    constructor(public playerCount: number, public lastMarbleScore: number) {
        for(let i = 0; i < this.playerCount; i++) {
            this.players.push(new Player());
        }
    }

    public play() {
        while(this.lowestRemainingMarble <= this.lastMarbleScore) {
            this.playTurn();
        }
    }

    public playTurn() {
        if(this.lowestRemainingMarble % 23 === 0) {
            this.handleMultiple23();
        } else {
            this.insertMarble();
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.playerCount;
    }

    public getHighestScore() {
        return maxBy(this.players, player => player.score).score
    }

    public printState() {
        const marbles = this.marbles.map((marble, index) => this.currentMarbleIndex === index ? `(${marble})` : ` ${marble} `).join("");

        return `P${this.currentPlayerIndex.toString().padStart(2, "0")} ${this.currentPlayer.score.toString().padStart(2, "0")}  - ${marbles}`;
    }

    private handleMultiple23() {
        this.currentPlayer.score += this.lowestRemainingMarble;
        this.lowestRemainingMarble++;

        const marbleToRemoveIndex = mod(this.currentMarbleIndex - 7, this.marbles.length);

        this.currentPlayer.score += this.marbles[marbleToRemoveIndex];
        this.marbles.splice(marbleToRemoveIndex, 1);

        this.currentMarbleIndex = marbleToRemoveIndex % this.marbles.length;
    }

    private insertMarble() {
        const nextMarbleIndex = ((this.currentMarbleIndex + 1) % this.marbles.length) + 1;
        this.marbles.splice(nextMarbleIndex, 0, this.lowestRemainingMarble);

        this.lowestRemainingMarble++;
        this.currentMarbleIndex = nextMarbleIndex;
    }

    get currentMarble() {
        return this.marbles[this.currentMarbleIndex];
    }

    get currentPlayer() {
        return this.players[this.currentPlayerIndex];
    }
}

function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

(() => {
    const game1 = new Game(486, 70833);

    game1.play();
    console.log(game1.getHighestScore());

    const game2 = new Game(486, 70833 * 100);
    game2.play();
    console.log(game2.getHighestScore());
})();
