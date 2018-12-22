import { HashTable } from "./hashtable";
import { Coord } from "./geometry";

test('can get after set', () => {
    const map = new HashTable();

    map.set(new Coord(1, 1), "foo");

    expect(map.get(new Coord(1, 1))).toBe("foo");
});

test('setting multiple times overrides old value', () => {
    const map = new HashTable();

    map.set(new Coord(1, 1), "foo");
    map.set(new Coord(1, 1), "bar");

    expect(map.get(new Coord(1, 1))).toBe("bar");
});

test('get returns undefined for values not added', () => {
    const map = new HashTable();

    map.set(new Coord(1, 1), 1);

    expect(map.get(new Coord(0, 1))).toBe(undefined);
});

test('has returns false for values not added', () => {
    const map = new HashTable();

    expect(map.has(new Coord(1, 1))).toBe(false);
});

test('has returns true after value has been added', () => {
    const map = new HashTable();

    map.set(new Coord(1, 1), 1);

    expect(map.has(new Coord(1, 1))).toBe(true);
});
