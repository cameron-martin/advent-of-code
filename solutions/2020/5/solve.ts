import { maxBy } from "../../../lib/collections";
import { puzzle } from "../../../lib/puzzle";
import { getInputLines } from "../../../lib/user-input";

export default puzzle(async () => {
    const seatNumbers = (await getInputLines(__dirname)).map(getSeatNumber);
    
    return {
        part1: solvePart1(seatNumbers),
        part2: solvePart2(seatNumbers),
    };
});

function getSeatNumber(seat: string) {
    let seatNumber = 0;

    for(let i = 0; i < 10; i++) {
        if(seat[i] == 'B' || seat[i] === 'R') {
            seatNumber += Math.pow(2, 9 - i);
        }
    }

    return seatNumber;
}

function solvePart1(seatNumbers: number[]) {
    return maxBy(seatNumbers, x => x);
}

function solvePart2(seatNumbers: number[]): number {
    const maxSeatNumber = maxBy(seatNumbers, x => x);

    let seatNumbersSet = new Set(seatNumbers);

    for(let i = 1; i < maxSeatNumber; i++) {
        if(!seatNumbersSet.has(i) && seatNumbersSet.has(i-1) && seatNumbersSet.has(i+1)) {
            return i;
        }
    }

    throw new Error('Could not find seat');
}