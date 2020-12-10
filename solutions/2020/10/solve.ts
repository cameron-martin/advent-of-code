import { product } from "../../../lib/collections";
import { puzzle } from "../../../lib/puzzle";
import { getInputLines } from "../../../lib/user-input";

export default puzzle(async () => {
    const adapterJolts = (await getInputLines(__dirname)).map((line) => Number.parseInt(line, 10));
    
    return {
        part1: solvePart1(adapterJolts),
        part2: solvePart2(adapterJolts),
    };
});

function solvePart1(adapterJolts: number[]) {
    const sorted = [0, ...adapterJolts].sort((a, b) => a - b);

    const distribution: Record<1 | 2 | 3, number> = {
        1: 0,
        2: 0,
        3: 1,
    }

    for(let i = 0; i < sorted.length - 1; i++) {
        const difference = sorted[i + 1] - sorted[i];

        if(difference !== 1 && difference !== 2 && difference !== 3) {
            throw new Error(`Difference ${difference} not valid`);
        }

        distribution[difference] += 1;
    }

    return distribution[1] * distribution[3];
}

function solvePart2(adapterJolts: number[]) {
    const sorted = [0, ...adapterJolts].sort((a, b) => a - b);

    return product(splitOnThree(sorted).map(jolts => countCombinations(jolts[0], jolts.slice(1))))
}

function splitOnThree(adaptorJolts: number[]): number[][] {
    if(adaptorJolts.length === 0) {
        return [];
    }

    const result = [[adaptorJolts[0]]];

    for(let i = 1; i < adaptorJolts.length; i++) {
        if(adaptorJolts[i] - adaptorJolts[i-1] === 3) {
            result.push([adaptorJolts[i]]);
        } else {
            result[result.length - 1].push(adaptorJolts[i]);
        }
    }

    return result;
}

function countCombinations(lastJolts: number, restJolts: number[]): number {
    if(restJolts.length <= 1) {
        return 1;
    }

    const others = restJolts.slice(1);

    // Can we remove the current item?
    if(others[0] - lastJolts <= 3) {
        return countCombinations(lastJolts, others) + countCombinations(restJolts[0], others);
    } else {
        return countCombinations(restJolts[0], others);
    }
}
