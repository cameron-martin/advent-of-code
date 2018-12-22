import { getInputLines } from '../../../lib/user-input';
import { Coord } from '../../../lib/geometry';
import { puzzle } from '../../../lib/puzzle';

export default puzzle(async () => {
    const lines = await getInputLines(__dirname);

    const fabricSections = lines.map(FabricSection.parse);

    const fabric = new Fabric();

    for(const fabricSection of fabricSections) {
        fabric.addFabricSection(fabricSection);
    }

    return {
        part1: solvePart1(fabric),
        part2: solvePart2(fabric),
    };
});

function solvePart1(fabric: Fabric) {
    return fabric.countPointsWithCoverage(coverage => coverage > 1);
}

function solvePart2(fabric: Fabric) {
    for(const fabricSection of fabric.sections) {
        if(!fabric.isOverlapping(fabricSection)) {
            return fabricSection.id;
        }
    }

    throw new Error();
}

class FabricSection {
    static parse(line: string): FabricSection {
        const match = line.match(/^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/);

        if(!match) throw new Error('Match failed');

        return new FabricSection(
            Number.parseInt(match[1]),
            new Coord(Number.parseInt(match[2]), Number.parseInt(match[3])),
            new Coord(Number.parseInt(match[4]), Number.parseInt(match[5])),
        );
    }

    constructor(public id: number, public origin: Coord, public size: Coord) {}

    public* getCoords(): IterableIterator<Coord> {
        for(let x = this.origin.x; x < this.origin.x + this.size.x; x++) {
            for(let y = this.origin.y; y < this.origin.y + this.size.y; y++) {
                yield new Coord(x, y);
            }
        }
    }
}

class Fabric {
    coverage = new Map<number, Map<number, number>>();

    sections: FabricSection[] = [];

    private addCoveragePoint({x, y}: Coord): void {
        if(!this.coverage.has(x)) this.coverage.set(x, new Map());

        const innerMap = this.coverage.get(x)!;

        if(!innerMap.has(y)) innerMap.set(y, 0);

        innerMap.set(y, innerMap.get(y)! + 1);
    }

    public addFabricSection(fabricSection: FabricSection): void {
        this.sections.push(fabricSection);
        for(const coord of fabricSection.getCoords()) {
            this.addCoveragePoint(coord);
        }
    }

    public isOverlapping(fabricSection: FabricSection): boolean {
        for(const coord of fabricSection.getCoords()) {
            if(this.getCoverageForPoint(coord) > 1) {
                return true;
            }
        }

        return false;
    }

    public getCoverageForPoint({x, y}: Coord) {
        const innerMap = this.coverage.get(x);

        if(!innerMap) return 0;

        return innerMap.get(y) || 0;
    }

    public countPointsWithCoverage(predicate: (coverage: number) => boolean) {
        let count = 0;

        for(const [x, xCoverage] of this.coverage) {
            for(const [y, xyCoverage] of xCoverage) {
                if(predicate(xyCoverage)) {
                    count++;
                }
            }
        }

        return count;
    }
}
