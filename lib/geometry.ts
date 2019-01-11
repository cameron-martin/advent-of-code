import { minBy, maxBy, cartesianProduct } from "./collections";
import { Hashable, Equatable } from "./hashtable";

export class Vector2 implements Hashable {
    static origin = new Vector2(0, 0);

    constructor(public x: number, public y: number) {}

    get hash() {
        // TODO: This has a lot of collisions - reconsider this if performance becomes an issue.
        return this.x * 10000 + this.y;
    }

    equals(other: Vector2) {
        return this.x === other.x && this.y === other.y;
    }

    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}

export class Vector3 {
    static origin = new Vector3(0, 0, 0);

    constructor(public readonly x: number, public readonly y: number, public readonly z: number) {}

    get hash() {
        return this.x * 100000000 + this.y * 10000 + this.y;
    }
    
    equals(other: Vector3): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    add(other: Vector3): Vector3 {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    toString(): string {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }

}

export class Rectangle {
    static bounding(coords: Vector2[]) {
        return new Rectangle(
            new Vector2(
                minBy(coords, coord => coord.x).x,
                minBy(coords, coord => coord.y).y,
            ),
            new Vector2(
                maxBy(coords, coord => coord.x).x,
                maxBy(coords, coord => coord.y).y,
            )
        );
    }

    constructor(public min: Vector2, public max: Vector2) {}

    *cells(): IterableIterator<Vector2> {
        for(let x = this.min.x; x <= this.max.x; x++) {
            for(let y = this.min.y; y <= this.max.y; y++) {
                yield new Vector2(x, y);
            }
        }
    }

    isOnBoundary(coord: Vector2) {
        return [this.min.x, this.max.x].includes(coord.x) || [this.min.y, this.max.y].includes(coord.y);
    }
}

export class Cuboid implements Equatable {
    static bounding(coords: Vector3[]) {
        return new Cuboid(
            new Vector3(
                minBy(coords, coord => coord.x).x,
                minBy(coords, coord => coord.y).y,
                minBy(coords, coord => coord.z).z,
            ),
            new Vector3(
                maxBy(coords, coord => coord.x).x,
                maxBy(coords, coord => coord.y).y,
                maxBy(coords, coord => coord.z).z,
            )
        );
    }

    constructor(public min: Vector3, public max: Vector3) {}

    split(): Cuboid[] {
        return cartesianProduct(
            this.splitCoord(this.min.x, this.max.x),
            this.splitCoord(this.min.y, this.max.y),
            this.splitCoord(this.min.z, this.max.z),
        ).map(([x, y, z]) => 
            new Cuboid(
                new Vector3(x.min, y.min, z.min),
                new Vector3(x.max, y.max, z.max),
            )
        );
    }

    get volume() {
        return (this.max.x - this.min.x + 1)
            * (this.max.y - this.min.y + 1)
            * (this.max.z - this.min.z + 1);
    }

    private splitCoord(min: number, max: number) {
        if(min === max) return [{ min, max }];

        const width1 = Math.floor((max - min + 1) / 2);

        return [
            { min, max: min + width1 - 1 },
            { min: min + width1, max },
        ];
    }

    contains(coord: Vector3) {
        return this.min.x <= coord.x && coord.x <= this.max.x
            && this.min.y <= coord.y && coord.y <= this.max.y
            && this.min.z <= coord.z && coord.z <= this.max.z;
    }

    equals(other: this): boolean {
        return this.min.equals(other.min) && this.max.equals(other.max);
    }
}

export function manhattanDistance(coord1: Vector2 | Vector3, coord2: Vector2 | Vector3) {
    let value = Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y);

    if('z' in coord1 && 'z' in coord2) {
        value += Math.abs(coord1.z - coord2.z);
    }

    return value;
}
