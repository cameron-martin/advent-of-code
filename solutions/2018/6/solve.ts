import { Coord, manhattanDistance } from "../../../lib/geometry";
import { maxBy, minBy } from "../../../lib/collections";
import { getInputLines } from "../../../lib/user-input";
import { puzzle } from "../../../lib/puzzle";
import { sum } from "../../../lib/arrays";

export default puzzle(async () => {
    const coords = (await getInputLines(__dirname)).map(parseInput);

    const boundingBox = Box.bounding(coords);

    return {
        part1: solvePart1(coords, boundingBox),
        part2: solvePart2(coords, boundingBox),
    }
});

function solvePart1(coords: Coord[], boundingBox: Box) {
    const areas = new Map<Coord, Area>();
    for(const coord of coords) areas.set(coord, new Area());

    for(const currentCoord of boundingBox.cells()) {
        const [nearest, secondNearest] = kNearestNeighbours(currentCoord, coords, 2, manhattanDistance);

        if(nearest.distance !== secondNearest.distance) {
            const area = areas.get(nearest.coord)!;

            area.size++;

            if(boundingBox.isOnBoundary(currentCoord)) {
                area.onBoundary = true;
            }
        }
    }

    const finiteAreas = Array.from(areas.values()).filter(area => !area.onBoundary);

    const biggestArea = maxBy(finiteAreas, area => area.size);

    return biggestArea.size;
}

function solvePart2(coords: Coord[], boundingBox: Box) {
    let area = 0;
    for(const currentCoord of boundingBox.cells()) {
        const totalDistance = sum(coords.map(coord => manhattanDistance(coord, currentCoord)));

        if(totalDistance < 10000) {
            area++;
        }
    }

    return area;
}

function parseInput(input: string): Coord {
    const [x, y] = input.split(", ").map(n => Number.parseInt(n));

    return { x, y };
}

class Area {
    size = 0;
    onBoundary = false;
}

class Box {
    static bounding(coords: Coord[]) {
        return new Box(
            {
                x: minBy(coords, coord => coord.x).x,
                y: minBy(coords, coord => coord.y).y,
            },
    
            {
                x: maxBy(coords, coord => coord.x).x,
                y: maxBy(coords, coord => coord.y).y,
            }
        );
    }

    constructor(public min: Coord, public max: Coord) {}

    *cells(): IterableIterator<Coord> {
        for(let x = this.min.x; x <= this.max.x; x++) {
            for(let y = this.min.y; y <= this.max.y; y++) {
                yield { x, y };
            }
        }
    }

    isOnBoundary(coord: Coord) {
        return [this.min.x, this.max.x].includes(coord.x) || [this.min.y, this.max.y].includes(coord.y);
    }
}

interface Neighbour {
    distance: number;
    coord: Coord;
}

function kNearestNeighbours(coord: Coord, coords: Coord[], k: number, calculateDistance: (coord1: Coord, coord2: Coord) => number): Neighbour[] {
    // Ordered from lowest to highest distance
    const nearest: Neighbour[] = [];

    for(let i = 0; i < coords.length; i++) {
        const distance = calculateDistance(coord, coords[i]);

        if(nearest.length < k) {
            insertOrdered(nearest, { distance, coord: coords[i] }, x => x.distance);
        } else if(distance < nearest[nearest.length - 1].distance) {
            insertOrdered(nearest, { distance, coord: coords[i] }, x => x.distance);
            nearest.pop();
        }
    }

    return nearest;
}

/**
 * Insert an element into an ordered list, while maintaining ordering.
 * This is essentially one iteration of insertion sort.
 */
function insertOrdered<T>(list: T[], elementToInsert: T, by: (element: T) => number): void {
    const elementToInsertBy = by(elementToInsert);

    const index = list.findIndex(elem => by(elem) > elementToInsertBy);

    if(index === -1) {
        list.push(elementToInsert);
    } else {
        list.splice(index, 0, elementToInsert);
    }
}
