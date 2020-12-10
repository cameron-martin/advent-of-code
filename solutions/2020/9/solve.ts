import { minBy, sum } from "../../../lib/collections";
import { puzzle } from "../../../lib/puzzle";
import { getInputLines } from "../../../lib/user-input";

export default puzzle(async () => {
    const numbers = (await getInputLines(__dirname)).map((line) => Number.parseInt(line, 10));
    
    const firstInvalidNumber = solvePart1(numbers);

    return {
        part1: firstInvalidNumber,
        part2: solvePart2(numbers, firstInvalidNumber),
    };
});

function solvePart1(numbers: number[]) {
    for(let i = 25; i < numbers.length; i++) {
        if(!anyLast25NumbersSum(numbers, i)) {
            return numbers[i];
        }
    }

    throw new Error('Could not find number with this property');
}

function anyLast25NumbersSum(numbers: number[], i: number) {
    for(let j = i - 25; j < i - 1; j++) {
        for(let k = j + 1; k < i; k++) {
            if(numbers[j] + numbers[k] === numbers[i]) {
                return true;
            }
        }
    }

    return false;
}

function solvePart2(numbers: number[], firstInvalidNumber: number) {
    for(let i = 0; i < numbers.length - 1; i++) {
        for(let j = i + 2; j <= numbers.length; j++) {
            const range = numbers.slice(i, j);
            const rangeSum = sum(range);

            if(rangeSum === firstInvalidNumber) {
                return Math.min(...range) + Math.max(...range);
            } else if(rangeSum > firstInvalidNumber) {
                break;
            }
        }
    }
}
