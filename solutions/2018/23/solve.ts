import { puzzle } from "../../../lib/puzzle";
import { Vector3, manhattanDistance, Cuboid } from "../../../lib/geometry";
import { getInputLines } from "../../../lib/user-input";
import { maxBy } from "../../../lib/collections";

export default puzzle(async () => {
    const lines = await getInputLines(__dirname);

    const bots = lines.map(parseInput);

    return {
        part1: solvePart1(bots),
        part2: solvePart2(bots),
    };
});

class NanoBot {
    constructor(public readonly coord: Vector3, public readonly signalRadius: number) {}

    // overlaps(box: Cuboid) {
    //     return box.contains(this.coord) || 
    // }
}

// pos=<19753426,69715835,25404341>, r=74542975
function parseInput(line: string) {
    const match = line.match(/^pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)$/);

    if(!match) throw new Error('Match failed');

    return new NanoBot(
        new Vector3(
            Number.parseInt(match[1]),
            Number.parseInt(match[2]),
            Number.parseInt(match[3]),
        ),
        Number.parseInt(match[4]),
    );
}

function solvePart1(bots: NanoBot[]) {
    const largestBot = maxBy(bots, bot => bot.signalRadius);

    return bots.filter(bot => manhattanDistance(largestBot.coord, bot.coord) <= largestBot.signalRadius).length;
}

function solvePart2(bots: NanoBot[]) {
    console.log(
        maxBy(bots, bot => bot.coord.x).coord.x,
        maxBy(bots, bot => bot.coord.y).coord.y,
    );
    
    return '';
}
