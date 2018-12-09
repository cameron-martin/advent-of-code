import fs from 'fs-extra';
import path from 'path';
import { getPuzzleResult } from './lib/puzzle';

const solutionsPath = path.join(__dirname, 'solutions')
const years = fs.readdirSync(solutionsPath);

years.forEach(year => {
    describe(`Year ${year}`, () => {
        const yearPath = path.join(solutionsPath, year);
        const days = fs.readdirSync(yearPath);

        days.forEach(day => {            
            test(`Day ${day}`, async () => {
                const result = await getPuzzleResult(Number.parseInt(year), Number.parseInt(day));

                expect(result).toMatchSnapshot();
            });
        });

    });
});