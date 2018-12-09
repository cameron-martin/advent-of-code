import { getInputLines } from "../../lib/user-input";

(async function() {
    const lines = await getInputLines(__dirname);

    const numbers = lines.map(line => Number.parseInt(line));

    // Part 1
    const sum = numbers.reduce((acc, n) => acc + n, 0);
    console.log(sum);

    // Part 2
    let acc = 0;
    let visitedNumbers = new Set<number>([acc]);

    loop:
    while(true) {
        for(const number of numbers) {
            acc += number;
    
            if(visitedNumbers.has(acc)) {
                console.log(acc);
                break loop;
            }
    
            visitedNumbers.add(acc);
        }
    }
})();