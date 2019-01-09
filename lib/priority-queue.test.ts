import { PriorityQueue } from './priority-queue';
import jsc from 'jsverify';
import { Equatable } from './hashtable';

class Foo implements Equatable {
    constructor(public readonly value: number) {}
    
    equals(other: this): boolean {
        return this.value === other.value;
    }
}

test('peek returns minimum value', () => jsc.assertForall(jsc.nearray(jsc.integer), priorities => {
    const queue = new PriorityQueue<Foo>();
    
    priorities.forEach(priority => {
        queue.add(new Foo(priority), priority);
    });

    expect(queue.peek().value).toBe(Math.min(...priorities));

    return true;
}));

test('pop yields values in order', () => jsc.assertForall(jsc.nearray(jsc.integer), priorities => {
    const queue = new PriorityQueue<Foo>();
    
    priorities.forEach(priority => {
        queue.add(new Foo(priority), priority);
    });

    const sorted = [...priorities].sort((a, b) => a - b);
    const popped = [];

    while(!queue.isEmpty()) {
        popped.push(queue.pop().value);
    }

    expect(popped).toEqual(sorted);

    return true;
}));
