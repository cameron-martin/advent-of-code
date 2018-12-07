import { Coord, manhattanDistance } from "../../lib/geometry";
import { maxBy, minBy } from "../../lib/collections";
import { getInputLines } from "../../lib/user-input";

(async () => {
    const coords = (await getInputLines(__dirname)).map(parseInput);

    const boundingBox = computeBoundingBox(coords);

    // Part 1
    const areas = new Map<Coord, Area>();
    for(const coord of coords) areas.set(coord, new Area());

    for(let x = boundingBox.min.x; x <= boundingBox.max.x; x++) {
        for(let y = boundingBox.min.y; y <= boundingBox.max.y; y++) {
            const currentCoord = { x, y };

            const [nearest, secondNearest] = kNearestNeighbours(currentCoord, coords, 2, manhattanDistance);

            if(nearest.distance !== secondNearest.distance) {
                const area = areas.get(nearest.coord)!;

                area.size++;

                if(isOnBoundary(currentCoord, boundingBox)) {
                    area.onBoundary = true;
                }
            }
        }
    }

    const finiteAreas = Array.from(areas.values()).filter(area => !area.onBoundary);

    const biggestArea = maxBy(finiteAreas, area => area.size);

    console.log(biggestArea.size);

    // Part 2
    let area = 0;
    for(let x = boundingBox.min.x; x <= boundingBox.max.x; x++) {
        for(let y = boundingBox.min.y; y <= boundingBox.max.y; y++) {
            const currentCoord = { x, y };
            const totalDistance = coords.map(coord => manhattanDistance(coord, currentCoord)).reduce((a, b) => a + b);

            if(totalDistance < 10000) {
                area++;
            }
        }
    }

    console.log(area);
})();

function parseInput(input: string): Coord {
    const [x, y] = input.split(", ").map(n => Number.parseInt(n));

    return { x, y };
}

class Area {
    size = 0;
    onBoundary = false;
}

interface Box {
    min: Coord;
    max: Coord;
}

function isOnBoundary(coord: Coord, box: Box) {
    return [box.min.x, box.max.x].includes(coord.x) || [box.min.y, box.max.y].includes(coord.y);
}

function computeBoundingBox(coords: Coord[]): Box {
    return {
        min: {
            x: minBy(coords, coord => coord.x).x,
            y: minBy(coords, coord => coord.y).y,
        },

        max: {
            x: maxBy(coords, coord => coord.x).x,
            y: maxBy(coords, coord => coord.y).y,
        }
    };
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
