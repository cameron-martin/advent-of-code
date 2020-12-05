import { puzzle } from "../../../lib/puzzle";
import { getInputLines } from "../../../lib/user-input";

export default puzzle(async () => {
    const numbers = (await getInputLines(__dirname)).map(line => Number.parseInt(line, 10));
    
    return {
        part1: solvePart1(numbers),
        part2: solvePart2(numbers),
    };
});

function solvePart1(numbers: number[]) {
    for(const n1 of numbers) {
        for(const n2 of numbers) {
            if(n1 + n2 === 2020) {
                return n1 * n2;
            }
        }
    }

    throw new Error('Could not find numbers that sum to 2020');
}

function solvePart2(numbers: number[]) {
    for(const n1 of numbers) {
        for(const n2 of numbers) {
            for(const n3 of numbers) {
                if(n1 + n2 + n3 === 2020) {
                    return n1 * n2 * n3;
                }
            }
        }
    }

    throw new Error('Could not find numbers that sum to 2020');
}