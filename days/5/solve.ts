import fs from 'fs-extra';
import path from 'path';
import { minBy } from '../../lib/collections';

(async () => {
    const input = (await fs.readFile(path.resolve(__dirname, 'input.txt'), { encoding: 'utf8' })).trim();

    console.log(reactPolymer(input).length);

    const polymers = genCharArray('a', 'z').map(char => ({ removedType: char, polymer: reactPolymer(removeType(char, input)) }));

    const lowestLength = minBy(polymers, ({ polymer }) => polymer.length);

    console.log(lowestLength.polymer.length);
})();

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
