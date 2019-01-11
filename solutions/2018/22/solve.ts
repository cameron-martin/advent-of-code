import { puzzle } from "../../../lib/puzzle";
import { Vector2, Rectangle, manhattanDistance } from "../../../lib/geometry";
import { memoise } from "../../../lib/memoisation";
import { Hashable } from "../../../lib/hashtable";
import { Child, aStar } from "../../../lib/astar";

export default puzzle(() => {
    /*
    depth: 3066
    target: 13,726
    */

    const depth = 3066;
    const target = new Vector2(13, 726);

    const cave = new Cave(depth, target);

    return {
        part1: solvePart1(cave),
        part2: solvePart2(cave),
    };
});

type RegionType = 'rocky' | 'wet' | 'narrow';

function solvePart1(cave: Cave) {
    const box = Rectangle.bounding([Vector2.origin, cave.target]);

    let risk = 0;
    for(const cell of box.cells()) {
        risk += cave.getRiskLevel(cell);
    }

    return risk;
}

function solvePart2(cave: Cave) {
    const { distance } = aStar(
        new State(new Vector2(0, 0), 'torch'),
        cave.targetState,
        (state1, state2) => manhattanDistance(state1.region, state2.region),
        node => cave.getStateTransitions(node)
    );

    return distance;
}

class Cave {
    constructor(public readonly depth: number, public readonly target: Vector2) {}

    get targetState() {
        return new State(this.target, 'torch')
    }

    getGeologicIndex(region: Vector2): number {
        if(region.equals(Vector2.origin) || region.equals(this.target)) {
            return 0;
        } else if(region.y === 0) {
            return region.x * 16807;
        } else if(region.x === 0) {
            return region.y * 48271;
        } else {
            return this.getErosionLevel(region.add(new Vector2(-1, 0))) * this.getErosionLevel(region.add(new Vector2(0, -1)))
        }
    }

    getErosionLevel = memoise((region: Vector2): number => {
        return (this.getGeologicIndex(region) + this.depth) % 20183;
    });

    getRegionType(region: Vector2): RegionType {
        switch(this.getRiskLevel(region)) {
            case 0: return 'rocky';
            case 1: return 'wet';
            case 2: return 'narrow';
            default: throw new Error('Impossible case');
        }
    }

    getRiskLevel(region: Vector2): number {
        return this.getErosionLevel(region) % 3;
    }

    getStateTransitions(currentState: State): Child<State>[] {
        const newRegionStates = this.getNeighbouringRegions(currentState.region)
            .map(region => new State(region, currentState.equipment))
            .filter(state => state.isValid(this))
            .map(state => ({ weight: 1, node: state }));

        const newEquipmentStates = equipmentStates
            .filter(equipmentState => equipmentState !== currentState.equipment)
            .map(equipmentState => new State(currentState.region, equipmentState))
            .filter(state => state.isValid(this))
            .map(state => ({ weight: 7, node: state }));

        return newRegionStates.concat(newEquipmentStates);
    }

    getNeighbouringRegions(region: Vector2) {
        return [
            region.add(new Vector2(0, 1)),
            region.add(new Vector2(1, 0)),
            region.add(new Vector2(0, -1)),
            region.add(new Vector2(-1, 0)),
        ].filter(coord => coord.x >= 0 && coord.y >= 0);
    }
}

const equipmentStates: EquipmentState[] = ['torch', 'climbing-gear', 'none'];

type EquipmentState = 'torch' | 'climbing-gear' | 'none';

class State implements Hashable {
    constructor(
        public region: Vector2,
        public equipment: EquipmentState,
    ) {}

    get hash(): number {
        return this.region.hash * (equipmentStates.indexOf(this.equipment) + 1);
    }

    equals(other: State) {
        return this.region.equals(other.region)
            && this.equipment === other.equipment;
    }

    toString() {
        return `{ region: ${this.region.toString()}, equipment: ${this.equipment} }`;
    }

    isValid(cave: Cave) {
        switch(cave.getRegionType(this.region)) {
            case 'rocky': return this.equipment !== 'none';
            case 'wet': return this.equipment !== 'torch';
            case 'narrow': return this.equipment !== 'climbing-gear';
        }
    }
}
