import { keyBy, sum } from "../../../lib/collections";
import { puzzle } from "../../../lib/puzzle";
import { getInputLines } from "../../../lib/user-input";

export default puzzle(async () => {
    const rules = parseInput(await getInputLines(__dirname));
    
    return {
        part1: solvePart1(rules),
        part2: solvePart2(rules),
    };
});

interface Rule {
    colour: string;
    contains: Array<{ count: number, colour: string }>;
}

function parseInput(lines: string[]): Rule[] {
    return lines.map(line => {
        // wavy turquoise bags contain 4 vibrant magenta bags, 4 light violet bags, 5 bright gold bags, 2 faded black bags.
        const match = line.match(/^(.*?) bags contain (.*)\.$/);

        if(!match) throw new Error('Cannot find match');

        return {
            colour: match[1],
            contains: match[2] == 'no other bags' ? [] : match[2].split(", ").map((part) => {
                const match = part.match(/^(\d+) (.*?) bags?$/);

                if(!match) throw new Error(`Invalid format: ${part}`);

                return {
                    count: Number.parseInt(match[1]),
                    colour: match[2],
                }
            })
        } 
    });
}

function solvePart1(rules: Rule[]) {
    const colours = new Set<string>(['shiny gold']);
    let coloursChanged = true;

    while(coloursChanged) {
        coloursChanged = false;

        for(const rule of rules) {
            rule.contains.forEach((innerBag) => {
                if(colours.has(innerBag.colour) && !colours.has(rule.colour)) {
                    coloursChanged = true;
                    colours.add(rule.colour);
                }
            });
        }
    }

    return colours.size - 1;
}

function totalBags(colour: string, rulesMap: Record<string, Rule>): number {
    const rule = rulesMap[colour];

    return 1 + sum(rule.contains.map(innerBag => totalBags(innerBag.colour, rulesMap) * innerBag.count));
}

function solvePart2(rules: Rule[]) {
    const rulesMap = keyBy(rules, rule => rule.colour);

    return totalBags('shiny gold', rulesMap) - 1;
}
