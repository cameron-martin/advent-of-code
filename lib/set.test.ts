import { subset, intersection, union } from "./set";

describe('subset', () => {
    test('is subset if included', () => {
        const a = new Set([1, 4, 5, 6]);
        const b = new Set([1, 2, 3, 4, 5, 6]);

        expect(subset(a, b)).toBe(true);
    });

    test('is not subset if no elements in common', () => {
        const a = new Set([1, 2, 3, 4, 5]);
        const b = new Set([6, 7, 8, 9, 10]);

        expect(subset(a, b)).toBe(false);
    });

    test('is not subset if some elements overlap but is not subset', () => {
        const a = new Set([1, 2, 3, 4, 5]);
        const b = new Set([4, 5, 6, 7, 8]);

        expect(subset(a, b)).toBe(false);
    });
});

describe('intersection', () => {
    test('intersection of multiple sets', () => {
        const a = new Set([1, 2, 3, 4]);
        const b = new Set([1, 2, 3, 6]);
        const c = new Set([2, 3, 4, 5]);

        expect(intersection(a, b, c)).toEqual(new Set([2, 3]));
    });

    test('intersection of no sets errors', () => {
        expect(() => intersection()).toThrowError('Cannot take intersection of no sets');
    });
});

describe('union', () => {
    test('union of multiple sets', () => {
        const a = new Set([1, 2, 3, 4]);
        const b = new Set([1, 2, 3, 6]);
        const c = new Set([2, 3, 4, 5]);

        expect(union(a, b, c)).toEqual(new Set([1, 2, 3, 4, 5, 6]));
    });

    test('union of no sets is the empty set', () => {
        expect(union()).toEqual(new Set([]));
    });
});
