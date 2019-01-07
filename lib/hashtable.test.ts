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

test('size returns the number of items', () => {
    const map = new HashTable();

    map.set(new Coord(1, 1), 1);
    map.set(new Coord(1, 1), 2);

    expect(map.size).toBe(1);

    map.set(new Coord(0, 0), 2);

    expect(map.size).toBe(2);
});

test('remove removes an element by key', () => {
    const map = new HashTable();

    map.set(new Coord(1, 1), 1);

    map.remove(new Coord(1, 1));

    expect(map.get(new Coord(1, 1))).toBeUndefined();
    expect(map.has(new Coord(1, 1))).toBe(false);
    expect(map.size).toBe(0);
});

test('entries returns all keys and values', () => {
    const map = new HashTable();

    map.set(new Coord(0, 0), 1);
    map.set(new Coord(1, 1), 2);

    const entries = map.entries;

    expect(entries.length).toBe(2);

    expect(entries[0][0].equals(new Coord(0, 0))).toBe(true);
    expect(entries[0][1]).toBe(1);

    expect(entries[1][0].equals(new Coord(1, 1))).toBe(true);
    expect(entries[1][1]).toBe(2);
});
