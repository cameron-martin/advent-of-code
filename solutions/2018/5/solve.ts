import { minBy } from '../../../lib/collections';
import { getInput } from '../../../lib/user-input';
import { puzzle } from '../../../lib/puzzle';

export default puzzle(async () => {
    const input = (await getInput(__dirname)).trim();

    return {
        part1: reactPolymer(input).length,
        part2: solvePart2(input),
    };
});

function solvePart2(input: string) {
    const polymers = genCharArray('a', 'z').map(char => ({ removedType: char, polymer: reactPolymer(removeType(char, input)) }));

    const lowestLength = minBy(polymers, ({ polymer }) => polymer.length);

    return lowestLength.polymer.length;
}

function reactPolymer(polymer: string): string {
    let output = polymer;

    for(let i = 0; i < output.length - 1; i++) {
        if(output[i] !== output[i+1] && output[i].toLowerCase() === output[i+1].toLowerCase()) {
            output = output.slice(0, i) + output.slice(i + 2);
            i = Math.max(-1, i - 2);
        }
    }

    return output;
}

function removeType(type: string, polymer: string) {
    let output = '';

    for(let i = 0; i < polymer.length; i++) {
        if(polymer[i].toLowerCase() !== type) output += polymer[i];
    }

    return output;
}

function genCharArray(charA: string, charZ: string) {
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
}
