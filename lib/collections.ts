export function maxBy<T>(array: T[], by: (elem: T) => number): T {
    return array.reduce((currentHighest, elem) => by(elem) > by(currentHighest) ? elem : currentHighest);
}

export function minBy<T>(array: T[], by: (elem: T) => number): T {
    return array.reduce((currentLowest, elem) => by(elem) < by(currentLowest) ? elem : currentLowest);
}

export function sum(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0);
}

export function product(numbers: number[]): number {
    return numbers.reduce((a, b) => a * b, 1);
}

type Arrays<T> = {
    [K in keyof T]: Array<T[K]>;
};

export function cartesianProduct<T extends any[]>(...args:  Arrays<T>): T[] {
    if(args.length === 0) return [[]] as any;

    const [init, ...rest] = args;

    const restProduct = cartesianProduct(...rest);

    return init.flatMap(val => restProduct.map(rest => [val, ...rest]) as any);
}

export function keyBy<T>(array: T[], f: (x: T) => string): Record<string, T> {
    const result: Record<string, T> = {};

    array.forEach((item) => {
        result[f(item)] = item;
    });

    return result;
}
