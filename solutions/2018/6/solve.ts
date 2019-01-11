import { Vector2, manhattanDistance, Rectangle } from "../../../lib/geometry";
import { maxBy, minBy, sum } from "../../../lib/collections";
import { getInputLines } from "../../../lib/user-input";
import { puzzle } from "../../../lib/puzzle";

export default puzzle(async () => {
    const coords = (await getInputLines(__dirname)).map(parseInput);

    const boundingBox = Rectangle.bounding(coords);

    return {
        part1: solvePart1(coords, boundingBox),
        part2: solvePart2(coords, boundingBox),
    }
});

function solvePart1(coords: Vector2[], boundingBox: Rectangle) {
    const areas = new Map<Vector2, Area>();
    for(const coord of coords) areas.set(coord, new Area());

    for(const currentVector2 of boundingBox.cells()) {
        const [nearest, secondNearest] = kNearestNeighbours(currentVector2, coords, 2, manhattanDistance);

        if(nearest.distance !== secondNearest.distance) {
            const area = areas.get(nearest.coord)!;

            area.size++;

            if(boundingBox.isOnBoundary(currentVector2)) {
                area.onBoundary = true;
            }
        }
    }

    const finiteAreas = Array.from(areas.values()).filter(area => !area.onBoundary);

    const biggestArea = maxBy(finiteAreas, area => area.size);

    return biggestArea.size;
}

function solvePart2(coords: Vector2[], boundingBox: Rectangle) {
    let area = 0;
    for(const currentVector2 of boundingBox.cells()) {
        const totalDistance = sum(coords.map(coord => manhattanDistance(coord, currentVector2)));

        if(totalDistance < 10000) {
            area++;
        }
    }

    return area;
}

function parseInput(input: string): Vector2 {
    const [x, y] = input.split(", ").map(n => Number.parseInt(n));

    return new Vector2(x, y);
}

class Area {
    size = 0;
    onBoundary = false;
}

interface Neighbour {
    distance: number;
    coord: Vector2;
}

function kNearestNeighbours(coord: Vector2, coords: Vector2[], k: number, calculateDistance: (coord1: Vector2, coord2: Vector2) => number): Neighbour[] {
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
