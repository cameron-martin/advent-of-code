import { sum } from "../../../lib/collections";
import { puzzle } from "../../../lib/puzzle";
import { intersection, union } from "../../../lib/set";
import { getInput } from "../../../lib/user-input";

export default puzzle(async () => {
    const groups = parseInput(await getInput(__dirname));
    
    return {
        part1: solvePart1(groups),
        part2: solvePart2(groups),
    };
});

function parseInput(input: string) {
    const groups = input.split("\n\n");

    return groups.map(group => group.split("\n").map((person) => new Set(person.split(""))));
}

function solvePart1(groups: Set<string>[][]) {
    return sum(groups.map(group => {
        return union(...group).size;
    }));
}

function solvePart2(groups: Set<string>[][]) {
    return sum(groups.map(group => {
        return intersection(...group).size;
    }));
}
