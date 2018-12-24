export interface Equatable {
    equals(other: this): boolean;
}

export interface Hashable extends Equatable {
    /**
     * The following condition must hold true:
     *
     * `a.equals(b)` implies `a.hash === b.hash`
     */
    readonly hash: number;
}

interface Item<K, V> {
    key: K;
    value: V;
}

export class HashTable<K extends Hashable, V> {
    private buckets = new Map<number, Item<K, V>[]>();

    private getBucket(key: K) {
        const hash = key.hash;

        if(!this.buckets.has(hash)) this.buckets.set(hash, []);
        return this.buckets.get(hash)!;
    }

    set(key: K, value: V): void {
        let bucket = this.getBucket(key);

        const currentIndex = bucket.findIndex(item => item.key.equals(key));

        if(currentIndex === -1) {
            bucket.push({ key, value });
        } else {
            bucket.splice(currentIndex, 1, { key, value });
        }
    }

    get(key: K): V | undefined {
        const bucket = this.getBucket(key);

        const item = bucket.find(item => item.key.equals(key));

        if(item !== undefined) {
            return item.value;
        }
    }

    has(key: K): boolean {
        const bucket = this.getBucket(key);

        return bucket.some(item => item.key.equals(key));
    }
}
