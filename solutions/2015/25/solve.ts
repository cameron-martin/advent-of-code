import { Vector2 } from "../../../lib/geometry";
import { puzzle } from "../../../lib/puzzle";

export default puzzle(async () => {
    const coord = new Vector2(2947, 3029);

    return {
        part1: iterate(coordToIndex(coord), nextValue, 20151125)
    };
});

function nextValue(value: number): number {
    return (value * 252533) % 33554393;
}

function iterate<T>(n: number, f: (val: T) => T, init: T) {
    let val = init;

    for(let i = 0; i < n; i++) {
        val = f(val);
    }

    return val;
}

/**
 * This is the cantor pairing function
 */
function coordToIndex(coord: Vector2) {
    const x = coord.x - 1;
    const y = coord.y - 1;

    return ((x + y) * (x + y + 1)) / 2 + y;
}
