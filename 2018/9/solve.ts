import { maxBy } from "../../lib/collections";

class Player {
    score = 0;
}

class Marbles {
    current: Marble;

    constructor(marbleValue: number) {
        const marble = new Marble(marbleValue);

        marble.left = marble;
        marble.right = marble;

        this.current = marble;
    }

    /**
     * Deletes the current marble and moves the current marble to the right
     */
    deleteCurrent() {
        this.current.left.right = this.current.right;
        this.current.right.left = this.current.left;

        this.current = this.current.right;
    }

    /**
     * Inserts a new marble to the right of the current marble
     */
    insertRight(value: number) {
        const newMarble = new Marble(value);

        newMarble.right = this.current.right;
        newMarble.left = this.current;

        this.current.right.left = newMarble;
        this.current.right = newMarble;
    }

    moveLeft() {
        this.rotate(-1);
    }

    moveRight() {
        this.rotate(1);
    }

    /**
     * Moves the current element clockwise by amount.
     */
    rotate(amount: number) {
        const direction = amount < 0 ? 'left' : 'right';

        for(let i = 0; i < Math.abs(amount); i++) {
            this.current = this.current[direction];
        }
    }
}

class Marble {
    constructor(public value: number) {}

    left!: Marble;
    right!: Marble;
}

class Game {
    public readonly players: Player[] = [];
    public currentPlayerIndex = 0;
    public marbles = new Marbles(0);
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
            this.marbles.rotate(-7);

            this.currentPlayer.score += this.marbles.current.value + this.lowestRemainingMarble;

            this.lowestRemainingMarble++;
            this.marbles.deleteCurrent();
        } else {
            this.marbles.moveRight();
            this.marbles.insertRight(this.lowestRemainingMarble);
            this.marbles.moveRight();

            this.lowestRemainingMarble++;
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.playerCount;
    }

    public getHighestScore() {
        return maxBy(this.players, player => player.score).score
    }

    get currentPlayer() {
        return this.players[this.currentPlayerIndex];
    }
}

(() => {
    const game1 = new Game(486, 70833);

    game1.play();
    console.log(game1.getHighestScore());

    const game2 = new Game(486, 70833 * 100);
    game2.play();
    console.log(game2.getHighestScore());
})();
