import { getInputLines } from "../../../lib/user-input";
import { puzzle } from "../../../lib/puzzle";

export default puzzle(async () => {
    const lines = await getInputLines(__dirname);

    const numbers = lines.map(line => Number.parseInt(line));

    // Part 1
    return {
        part1: solvePart1(numbers),
        part2: solvePart2(numbers),
    };
});

function solvePart1(numbers: number[]) {
    return numbers.reduce((acc, n) => acc + n, 0);
}

function solvePart2(numbers: number[]) {
    let acc = 0;
    let visitedNumbers = new Set<number>([acc]);

    while(true) {
        for(const number of numbers) {
            acc += number;
    
            if(visitedNumbers.has(acc)) {
                return acc;
            }
    
            visitedNumbers.add(acc);
        }
    }
}