import path from 'path';

export interface PuzzleResult {
    part1: string | number;
    part2?: string | number;
}

type PuzzleDefintion = () => PuzzleResult | Promise<PuzzleResult>;

export const puzzle = (puzzleDefintion: PuzzleDefintion): PuzzleDefintion => puzzleDefintion;

export async function getPuzzleResult(year: number, day: number): Promise<PuzzleResult> {
    const puzzle = require(`../solutions/${year}/${day}/solve`).default;

    return puzzle();
}
