import { getInput } from "../../../lib/user-input";
import { puzzle } from "../../../lib/puzzle";

export default puzzle(async () => {
    const input = await getInput(__dirname);

    return {
        part1: solvePart1(input),
        part2: solvePart2(input),
    }
});

function solvePart1(input: string) {
    let floor = 0;
    
    for(let i = 0; i < input.length; i++) {
        const char = input[i];
        

        if(char === '(') floor++;
        else if(char === ')') floor--;
        else throw new Error();
    }

    return floor;
}

function solvePart2(input: string) {
    let floor = 0;
    
    for(let i = 0; i < input.length; i++) {
        const char = input[i];

        if(char === '(') floor++;
        else if(char === ')') floor--;
        else throw new Error();

        if(floor === -1) {
            return i + 1;
        }
    }

    throw new Error();
}
