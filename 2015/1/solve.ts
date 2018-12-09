import { getInput } from "../../lib/user-input";

(async () => {
    const input = await getInput(__dirname);

    solvePart1(input);
    solvePart2(input);
})();

function solvePart1(input: string) {
    let floor = 0;
    
    for(let i = 0; i < input.length; i++) {
        const char = input[i];
        

        if(char === '(') floor++;
        else if(char === ')') floor--;
        else throw new Error();
    }

    console.log(floor);
}

function solvePart2(input: string) {
    let floor = 0;
    
    for(let i = 0; i < input.length; i++) {
        const char = input[i];

        if(char === '(') floor++;
        else if(char === ')') floor--;
        else throw new Error();

        if(floor === -1) {
            console.log(i + 1);
            break;
        }
    }
}
