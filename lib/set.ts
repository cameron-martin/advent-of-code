export function subset<T>(a: Set<T>, b: Set<T>): boolean {
    let isSubset = true;

    a.forEach((elem) => {
        if(!b.has(elem)) {
            isSubset = false;
        }
    });

    return isSubset;
}

export function intersection<T>(...sets: Set<T>[]): Set<T> {
    if(sets.length === 0) {
        throw new Error('Cannot take intersection of no sets');
    }

    const [head, ...tail] = sets;

    let result = new Set<T>();

    head.forEach((item) => {
        if(tail.every((otherSet) => otherSet.has(item))) {
            result.add(item);
        }
    });

    return result;
}

export function union<T>(...sets: Set<T>[]): Set<T> {
    const result = new Set<T>();

    sets.forEach((set) => {
        set.forEach(item => {
            result.add(item);
        });
    });

    return result;
}