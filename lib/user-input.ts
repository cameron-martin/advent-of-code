import fs from 'fs-extra';
import path from 'path';

export async function getInputLines(puzzleDirectory: string): Promise<string[]> {
    const fileContents = await fs.readFile(path.resolve(puzzleDirectory, 'input.txt'), { encoding: 'utf8' });

    return fileContents.split("\n").map(line => line.trim()).filter(line => line !== '');
}
