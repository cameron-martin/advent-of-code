import { puzzle } from "../../../lib/puzzle";
import { getInputLines } from "../../../lib/user-input";

export default puzzle(async () => {
    const inputLines = (await getInputLines(__dirname)).map(parseInputLine);
    
    return {
        part1: solve(inputLines, part1Validator),
        part2: solve(inputLines, part2Validator),
    };
});

interface PasswordPolicy {
    letter: string;
    min: number;
    max: number;
}

interface InputLine {
    password: string;
    passwordPolicy: PasswordPolicy;
}

function parseInputLine(line: string): InputLine {
    const match = line.match(/^(\d+)-(\d+) ([a-z]): ([a-z]+)$/);

    if(!match) {
        throw new Error("line does not match expected pattern: " + line);
    }

    return {
        password: match[4],
        passwordPolicy: {
            letter: match[3],
            min: Number.parseInt(match[1], 10),
            max: Number.parseInt(match[2], 10),
        }
    }
}

function part1Validator(password: string, passwordPolicy: PasswordPolicy): boolean {
    const occurrenceCount = password.split("").filter(char => char === passwordPolicy.letter).length;

    return occurrenceCount >= passwordPolicy.min && occurrenceCount <= passwordPolicy.max;
}

function part2Validator(password: string, passwordPolicy: PasswordPolicy): boolean {
    const char1 = password[passwordPolicy.min - 1];
    const char2 = password[passwordPolicy.max - 1];

    return xor(char1 === passwordPolicy.letter, char2 === passwordPolicy.letter);
}

function xor(a: boolean, b: boolean) {
    return a ? !b : b;
}

function solve(inputLines: InputLine[], validator: (password: string, passwordPolicy: PasswordPolicy) => boolean) {
    return inputLines.filter(({ password, passwordPolicy }) => validator(password, passwordPolicy)).length;
}
