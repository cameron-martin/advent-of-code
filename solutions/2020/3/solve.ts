import { puzzle } from "../../../lib/puzzle";
import { getInputLines } from "../../../lib/user-input";

export default puzzle(async () => {
    const map = new Map(await getInputLines(__dirname));
    
    return {
        part1: solvePart1(map),
        part2: solvePart2(map),
    };
});

class Map {
    private width: number;
    public height: number;

    constructor(private readonly lines: string[]) {
        this.width = lines[0].length;
        this.height = lines.length;
    }
    
    isTree(x: number, y: number): boolean {
        const modX = (x % this.width);

        return this.lines[y][modX] === '#';
    }

    isInBounds(x: number, y: number) {
        return y < this.height;
    }
}

function getTreeCount(map: Map, xDelta: number, yDelta: number) {
    let x = 0;
    let y = 0;
    let treeCount = 0;

    while(map.isInBounds(x, y)) {
        treeCount += map.isTree(x, y) ? 1 : 0;
        x += xDelta;
        y += yDelta;
    }

    return treeCount;
}

function solvePart1(map: Map) {
    return getTreeCount(map, 3, 1);
}

function solvePart2(map: Map) {
    return getTreeCount(map, 1, 1)
        * getTreeCount(map, 3, 1)
        * getTreeCount(map, 5, 1)
        * getTreeCount(map, 7, 1)
        * getTreeCount(map, 1, 2);
}
