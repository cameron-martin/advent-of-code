import { memoise } from "./memoisation";
import { Coord } from "./geometry";

const fn = memoise((coord: Coord) => ({ coord }));

test('memoises the return value', () => {
    expect(fn(new Coord(0, 0))).toBe(fn(new Coord(0, 0)));
});

test('returns different values for different arguments', () => {
    expect(fn(new Coord(0, 0))).not.toBe(fn(new Coord(0, 1)));
});
