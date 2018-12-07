export interface Coord {
    x: number;
    y: number;
}

export function manhattanDistance(coord1: Coord, coord2: Coord) {
    return Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y);
}
