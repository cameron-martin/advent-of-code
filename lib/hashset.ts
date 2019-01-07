import { HashTable, Hashable } from "./hashtable";

export class HashSet<T extends Hashable> {
    private hashtable = new HashTable<T, boolean>();

    constructor() {}

    has(elem: T): boolean {
        return this.hashtable.get(elem) === true;
    }

    add(elem: T): void {
        this.hashtable.set(elem, true);
    }

    remove(elem: T) {
        this.hashtable.remove(elem);
    }

    get size(): number {
        return this.hashtable.size;
    }

    toArray(): T[] {
        return this.hashtable.entries.map(([key, value]) => key);
    }
}
