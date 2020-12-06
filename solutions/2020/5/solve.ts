import { count } from "console";
import { maxBy } from "../../../lib/collections";
import { puzzle } from "../../../lib/puzzle";
import { getInputLines } from "../../../lib/user-input";

export default puzzle(async () => {
    const lines = await getInputLines(__dirname);
    
    return {
        part1: solvePart1(lines),
        // part2: solvePart2(lines),
    };
});

function getSeatNumber(seat: string) {
    let seatNumber = 0;

    for(let i = 0; i < 9; i++) {
        if(seat[i] == 'B' || seat[i] === 'R') {
            seatNumber += Math.pow(2, 9 - i);
        }
    }

    return seatNumber;
}

function solvePart1(lines: string[]) {
    return maxBy(lines.map(getSeatNumber), x => x);
}
