import { puzzle } from "../../../lib/puzzle";
import { Coord, Box } from "../../../lib/geometry";
import { memoise } from "../../../lib/memoisation";

export default puzzle(() => {
    /*
    depth: 3066
    target: 13,726
    */

    const depth = 3066;
    const target = new Coord(13, 726);

    const cave = new Cave(depth, target);

    return {
        part1: solvePart1(cave),
    };
});

type RegionType = 'rocky' | 'wet' | 'narrow';

function solvePart1(cave: Cave) {
    const box = Box.bounding([Coord.origin, cave.target]);

    let risk = 0;
    for(const cell of box.cells()) {
        risk += cave.getRiskLevel(cell);
    }

    return risk;
}

class Cave {
    constructor(public depth: number, public target: Coord) {}

    getGeologicIndex(region: Coord): number {
        if(region.equals(Coord.origin) || region.equals(this.target)) {
            return 0;
        } else if(region.y === 0) {
            return region.x * 16807;
        } else if(region.x === 0) {
            return region.y * 48271;
        } else {
            return this.getErosionLevel(region.add(new Coord(-1, 0))) * this.getErosionLevel(region.add(new Coord(0, -1)))
        }
    }

    getErosionLevel = memoise((region: Coord): number => {
        return (this.getGeologicIndex(region) + this.depth) % 20183;
    });

    getRegionType(region: Coord): RegionType {
        switch(this.getRiskLevel(region)) {
            case 0: return 'rocky';
            case 1: return 'wet';
            case 2: return 'narrow';
            default: throw new Error('Impossible case');
        }
    }

    getRiskLevel(region: Coord): number {
        return this.getErosionLevel(region) % 3;
    }
}
