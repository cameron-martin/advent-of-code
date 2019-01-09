import { HashTable, Hashable } from "./hashtable";
import { PriorityQueue } from "./priority-queue";
import { HashSet } from "./hashset";

export interface Child<T> {
    node: T;
    weight: number;
}

function reconstruct_path<T extends Hashable>(cameFrom: HashTable<T, T>, current: T) {
    const path = [current];
    while(cameFrom.has(current)) {
        current = cameFrom.get(current)!;
        path.push(current);
    }

    return path;
}

export function aStar<T extends Hashable>(start: T, goal: T, heuristic: (a: T, b: T) => number, children: (node: T) => Child<T>[]) {
    const closedSet = new HashSet<T>();
    const openQueue = new PriorityQueue<T>();
    const openSet = new HashSet<T>();
    openQueue.add(start, heuristic(start, goal));
    openSet.add(start);

    const cameFrom = new HashTable<T, T>();

    const gScore = new HashTable<T, number>();
    gScore.set(start, 0);

    const fScore = new HashTable<T, number>();
    fScore.set(start, heuristic(start, goal));

    let current;
    while(!openQueue.isEmpty()) {
        current = openQueue.pop();
        openSet.remove(current);

        if(current.equals(goal)) {
            return { path: reconstruct_path(cameFrom, current), distance: gScore.get(current)! };
        }

        closedSet.add(current);

        for(const neighbour of children(current)) {
            if(closedSet.has(neighbour.node)) continue;

            const tentative_gScore = gScore.get(current)! + neighbour.weight;

            if (!openSet.has(neighbour.node)) {
                openSet.add(neighbour.node);
                openQueue.add(neighbour.node, tentative_gScore + heuristic(neighbour.node, goal))
            } else if(tentative_gScore >= gScore.get(neighbour.node)!) {
                continue;
            }

            cameFrom.set(neighbour.node, current);
            gScore.set(neighbour.node, tentative_gScore);
            const newfScore = tentative_gScore + heuristic(neighbour.node, goal);
            if(newfScore !== fScore.get(neighbour.node)) {
                openQueue.remove(neighbour.node);
                openQueue.add(neighbour.node, newfScore);
                fScore.set(neighbour.node, newfScore);
            }
        }
    }

    throw new Error('Could not find shortest path');
}