import { HashSet } from "./hashset";
import { Coord } from "./geometry";

test('set does not have elements that have not been added', () => {
    const set = new HashSet();

    expect(set.has(new Coord(0, 0))).toBe(false);
});

test('if I add an element to the set, then the set contains anything that is equal', () => {
    const set = new HashSet();

    set.add(new Coord(0, 0));

    expect(set.has(new Coord(0, 0))).toBe(true);
});

test('if I add then remove an element from the set, then the set no longer contains that element', () => {
    const set = new HashSet();

    set.add(new Coord(0, 0));
    set.remove(new Coord(0, 0));

    expect(set.has(new Coord(0, 0))).toBe(false);
})

test('size returns number of elements', () => {
    const set = new HashSet();

    set.add(new Coord(0, 0));
    set.add(new Coord(0, 0));

    expect(set.size).toBe(1);

    set.add(new Coord(0, 1));

    expect(set.size).toBe(2);
});

test('toArray returns all items in the set', () => {
    const set = new HashSet();

    set.add(new Coord(0, 0));
    set.add(new Coord(0, 0));

    set.add(new Coord(0, 1));
    set.add(new Coord(1, 1));

    const array = set.toArray();

    expect(array.length).toBe(3);
    expect(array[0].equals(new Coord(0, 0))).toBe(true);
    expect(array[1].equals(new Coord(0, 1))).toBe(true);
    expect(array[2].equals(new Coord(1, 1))).toBe(true);
});
