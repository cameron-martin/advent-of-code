import { Equatable } from "./hashtable";

function getParent(index: number): number {
    return Math.floor((index + 1) / 2) - 1;
}

function hasParent(index: number) {
    return index !== 0;
}

const getLeftChildIndex = (index: number) => 2 * index + 1;
const getRightChildIndex = (index: number) => 2 * index + 2;

interface HeapNode<T> {
    value: T;
    priority: number; 
}

export class PriorityQueue<T extends Equatable> {
    private heap: HeapNode<T>[] = [];

    private swap(index1: number, index2: number) {
        const tmp = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = tmp;
    }

    private hasLeftChild(index: number) {
        return getLeftChildIndex(index) < this.heap.length;
    }

    private hasRightChild(index: number) {
        return getRightChildIndex(index) < this.heap.length;
    }

    private getPriority(index: number) {
        return this.heap[index].priority;
    }

    private bubbleUp(index: number) {
        let currentIndex = index;

        while(hasParent(currentIndex) && this.getPriority(currentIndex) < this.getPriority(getParent(currentIndex))) {
            const parent = getParent(currentIndex);
            this.swap(currentIndex, parent);
            currentIndex = parent;
        }
    }

    private bubbleDown(index: number) {
        let currentIndex = index;

        while(this.hasLeftChild(currentIndex)) {
            let smallerChildIndex = getLeftChildIndex(currentIndex);

            if(this.hasRightChild(currentIndex) && this.getPriority(getRightChildIndex(currentIndex)) < this.getPriority(getLeftChildIndex(currentIndex))) {
                smallerChildIndex = getRightChildIndex(currentIndex);
            }

            if(this.heap[currentIndex].priority < this.heap[smallerChildIndex].priority) {
                break;
            }

            this.swap(currentIndex, smallerChildIndex);
            currentIndex = smallerChildIndex;
        }
    }

    add(item: T, priority: number): void {
        let index = this.heap.length;
        this.heap.push({ value: item, priority });

        this.bubbleUp(index);
    }

    peek(): T {
        if(this.isEmpty()) throw new Error('Empty heap');

        return this.heap[0].value;
    }

    pop(): T {
        if(this.isEmpty()) throw new Error('Empty heap');

        this.swap(0, this.heap.length - 1);

        const { value } = this.heap.pop()!;

        this.bubbleDown(0);

        return value;
    }

    removeIndex(index: number) {
        if(index === this.heap.length - 1) {
            this.heap.pop();
            return;
        }

        this.swap(index, this.heap.length - 1);
        this.heap.pop();


        if(hasParent(index) && this.getPriority(index) < this.getPriority(getParent(index))) {
            this.bubbleUp(index);
        } else {
            this.bubbleDown(index);
        }
    }

    remove(item: T) {
        const index = this.heap.findIndex(heapNode => heapNode.value.equals(item));

        if(index === -1) throw new Error('Cannot find item');

        this.removeIndex(index);
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }
}