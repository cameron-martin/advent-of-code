export function maxBy<T>(array: T[], by: (elem: T) => number): T {
    return array.reduce((currentHighest, elem) => by(elem) > by(currentHighest) ? elem : currentHighest);
}

export function minBy<T>(array: T[], by: (elem: T) => number): T {
    return array.reduce((currentLowest, elem) => by(elem) < by(currentLowest) ? elem : currentLowest);
}
