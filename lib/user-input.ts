import fs from 'fs-extra';
import path from 'path';

export async function getInputLines(puzzleDirectory: string): Promise<string[]> {
    const fileContents = await getInput(puzzleDirectory);

    return fileContents.split("\n").map(line => line.trim()).filter(line => line !== '');
}

export function getInput(puzzleDirectory: string): Promise<string> {
    return fs.readFile(path.resolve(puzzleDirectory, 'input.txt'), { encoding: 'utf8' })
}
