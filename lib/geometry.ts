import { minBy, maxBy } from "./collections";
import { Hashable } from "./hashtable";

export class Coord implements Hashable {
    static origin = new Coord(0, 0);

    constructor(public x: number, public y: number) {}

    get hash() {
        // TODO: This has a lot of collisions - reconsider this if performance becomes an issue.
        return this.x + this.y;
    }

    equals(other: Coord) {
        return this.x === other.x && this.y === other.y;
    }

    add(other: Coord) {
        return new Coord(this.x + other.x, this.y + other.y);
    }
}

export class Box {
    static bounding(coords: Coord[]) {
        return new Box(
            new Coord(
                minBy(coords, coord => coord.x).x,
                minBy(coords, coord => coord.y).y,
            ),
            new Coord(
                maxBy(coords, coord => coord.x).x,
                maxBy(coords, coord => coord.y).y,
            )
        );
    }

    constructor(public min: Coord, public max: Coord) {}

    *cells(): IterableIterator<Coord> {
        for(let x = this.min.x; x <= this.max.x; x++) {
            for(let y = this.min.y; y <= this.max.y; y++) {
                yield new Coord(x, y);
            }
        }
    }

    isOnBoundary(coord: Coord) {
        return [this.min.x, this.max.x].includes(coord.x) || [this.min.y, this.max.y].includes(coord.y);
    }
}

export function manhattanDistance(coord1: Coord, coord2: Coord) {
    return Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y);
}
