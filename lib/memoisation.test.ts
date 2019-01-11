import { memoise } from "./memoisation";
import { Vector2 } from "./geometry";

const fn = memoise((coord: Vector2) => ({ coord }));

test('memoises the return value', () => {
    expect(fn(new Vector2(0, 0))).toBe(fn(new Vector2(0, 0)));
});

test('returns different values for different arguments', () => {
    expect(fn(new Vector2(0, 0))).not.toBe(fn(new Vector2(0, 1)));
});
