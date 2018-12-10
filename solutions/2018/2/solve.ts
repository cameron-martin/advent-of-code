import { getInputLines } from '../../../lib/user-input';
import { puzzle } from '../../../lib/puzzle';

export default puzzle(async function() {
    const lines = await getInputLines(__dirname);

    return {
        part1: solvePart1(lines),
        part2: solvePart2(lines),
    }
});

function solvePart1(lines: string[]) {
    let threeRepetitions = 0;
    let twoRepetitions = 0;

    for(let line of lines) {
        const id = new Id(line);

        if(id.hasRepetition(3)) threeRepetitions++;
        if(id.hasRepetition(2)) twoRepetitions++;
    }

    return threeRepetitions * twoRepetitions;
}

function solvePart2(lines: string[]) {
    for(const [item1, item2] of allPairs(lines)) {
        if(differsBy1(item1, item2)) {
            return getSameCharacters(item1, item2);
        }
    }

    throw new Error();
}

function* allPairs<T>(list: T[]): IterableIterator<[T, T]> {
    for(let i = 0; i < (list.length - 1); i++) {
        for(let j = i + 1; j < list.length; j++) {
            yield [list[i], list[j]];
        }
    }
}

function differsBy1(id1: string, id2: string) {
    if(id1.length !== id2.length) throw new Error('strings must be of the same length');

    let differences = 0;
    for(let i = 0; i < id1.length; i++) {
        if(id1[i] !== id2[i]) differences++;
    }

    return differences === 1;
}

function getSameCharacters(id1: string, id2: string) {
    if(id1.length !== id2.length) throw new Error('strings must be of the same length');

    let sameCharacters = '';
    for(let i = 0; i < id1.length; i++) {
        if(id1[i] === id2[i]) sameCharacters += id1[i];
    }

    return sameCharacters;
}

class Id {
    letterCounts = new Map<string, number>();

    constructor(private id: string) {
        for(let letter of this.id) {
            this.letterCounts.set(letter, (this.letterCounts.get(letter) || 0) + 1);
        }
    }

    public hasRepetition(n: number) {
        return Array.from(this.letterCounts.values()).some(count => count === n);
    }
}