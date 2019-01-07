import { puzzle } from "../../../lib/puzzle";
import { Coord, Box, manhattanDistance } from "../../../lib/geometry";
import { memoise } from "../../../lib/memoisation";
import { Equatable, Hashable, HashTable } from "../../../lib/hashtable";
import { HashSet } from "../../../lib/hashset";
import { minBy } from "../../../lib/collections";

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
        part2: solvePart2(cave),
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

function solvePart2(cave: Cave) {
    const { distance } = aStar(
        new State(new Coord(0, 0), 'torch'),
        cave.targetState,
        (state1, state2) => manhattanDistance(state1.region, state2.region),
        node => cave.getStateTransitions(node)
    );

    return distance;
}

class Cave {
    constructor(public readonly depth: number, public readonly target: Coord) {}

    get targetState() {
        return new State(this.target, 'torch')
    }

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

    getStateTransitions(currentState: State): StateTransition[] {
        const newRegionStates = this.getNeighbouringRegions(currentState.region)
            .filter(region => this.canEnterRegion(region, currentState.equipment))
            .map(region => ({ time: 1, newState: new State(region, currentState.equipment) }));

        const newEquipmentStates = equipmentStates
            .filter(equipmentState => equipmentState !== currentState.equipment)
            .map(equipmentState => ({ time: 7, newState: new State(currentState.region, equipmentState) }));

        return newRegionStates.concat(newEquipmentStates);
    }

    getNeighbouringRegions(region: Coord) {
        return [
            region.add(new Coord(0, 1)),
            region.add(new Coord(1, 0)),
            region.add(new Coord(0, -1)),
            region.add(new Coord(-1, 0)),
        ].filter(coord => coord.x >= 0 && coord.y >= 0);
    }

    canEnterRegion(region: Coord, equipmentState: EquipmentState) {
        switch(this.getRegionType(region)) {
            case 'rocky': return equipmentState !== 'none';
            case 'wet': return equipmentState !== 'torch';
            case 'narrow': return equipmentState !== 'climbing-gear';
        }
    }
}

const equipmentStates: EquipmentState[] = ['torch', 'climbing-gear', 'none'];

type EquipmentState = 'torch' | 'climbing-gear' | 'none';

class State implements Hashable {
    constructor(
        public region: Coord,
        public equipment: EquipmentState,
    ) {}

    get hash(): number {
        return this.region.hash * (equipmentStates.indexOf(this.equipment) + 1);
    }

    equals(other: State) {
        return this.region.equals(other.region)
            && this.equipment === other.equipment;
    }
}

interface StateTransition {
    time: number;
    newState: State;
}


function reconstruct_path(cameFrom: HashTable<State, State>, current: State) {
    const path = [current];
    while(cameFrom.has(current)) {
        current = cameFrom.get(current)!;
        path.push(current);
    }

    return path;
}

function aStar(start: State, goal: State, heuristic: (a: State, b: State) => number, children: (node: State) => StateTransition[]) {
    const closedSet = new HashSet<State>();
    const openSet = new HashSet<State>();
    openSet.add(start);

    const cameFrom = new HashTable<State, State>();

    const gScore = new HashTable<State, number>();
    gScore.set(start, 0);

    const fScore = new HashTable<State, number>();
    fScore.set(start, heuristic(start, goal));

    let current;
    while(openSet.size !== 0) {
        current = minBy(openSet.toArray(), item => {
            const itemFScore = fScore.get(item);

            return itemFScore === undefined ? Infinity : itemFScore;
        });

        if(current.equals(goal)) {
            return { path: reconstruct_path(cameFrom, current), distance: gScore.get(current)! };
        }

        openSet.remove(current);
        closedSet.add(current);

        for(const neighbour of children(current)) {
            if(closedSet.has(neighbour.newState)) continue;

            const tentative_gScore = gScore.get(current)! + neighbour.time

            if (!openSet.has(neighbour.newState)) {
                openSet.add(neighbour.newState);
            } else if(tentative_gScore >= gScore.get(neighbour.newState)!) {
                continue;
            }

            cameFrom.set(neighbour.newState, current);
            gScore.set(neighbour.newState, tentative_gScore);
            fScore.set(neighbour.newState, gScore.get(neighbour.newState)! + heuristic(neighbour.newState, goal));
        }
    }

    throw new Error('Could not find shortest path');
}
