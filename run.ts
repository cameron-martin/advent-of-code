import { getPuzzleResult } from "./lib/puzzle";

const year = Number.parseInt(process.argv[2]);
const day = Number.parseInt(process.argv[3]);

if(Number.isNaN(year)) throw new Error('Year must be a number');
if(Number.isNaN(day)) throw new Error('Day must be a number');

process.on('unhandledRejection', reason => {
    console.error(reason);
    process.exit(1);
});

(async () => {
    const result = await getPuzzleResult(year, day);

    console.log(result.part1);
    console.log(result.part2);
})();
