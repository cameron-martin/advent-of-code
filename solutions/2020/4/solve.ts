import { count } from "console";
import { puzzle } from "../../../lib/puzzle";
import { getInput } from "../../../lib/user-input";

export default puzzle(async () => {
    const passports = parseInput(await getInput(__dirname));
    
    return {
        part1: solvePart1(passports),
        part2: solvePart2(passports),
    };
});

interface Passport {
    fields: Field[];
}

interface Field {
    key: string;
    value: string;
}

function parseInput(input: string): Passport[] {
    const passports = input.split("\n\n");

    return passports.map((passport) => {
        let fields = passport.split(/ |\n/g).map((field) => {
            let [key, value] = field.split(/:/);

            return { key, value };
        });

        return { fields };
    });
}

const requiredFields = new Set(['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']);

function subset<T>(a: Set<T>, b: Set<T>) {
    let isSubset = true;

    a.forEach((elem) => {
        if(!b.has(elem)) {
            isSubset = false;
        }
    });

    return isSubset;
}

function hasRequiredFields(passport: Passport) {
    let fieldKeys = new Set(passport.fields.map((field) => field.key));

    return subset(requiredFields, fieldKeys);
}

function solvePart1(passports: Passport[]) {
    return passports.filter(hasRequiredFields).length;
}

function isYearInRange(year: string, min: number, max: number) {
    if(year.match(/^\d{4}$/) == null) {
        return false;
    }

    let n = Number.parseInt(year, 10);

    return n >= min && n <= max;
}

const validEcl = new Set(['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']);

function validateField(field: Field): boolean {
    switch(field.key) {
        case 'byr': return isYearInRange(field.value, 1920, 2002);
        case 'iyr': return isYearInRange(field.value, 2010, 2020);
        case 'eyr': return isYearInRange(field.value, 2020, 2030);
        case 'hgt': {
            const match = field.value.match(/^(\d+)(cm|in)$/);

            if(match === null) return false;

            const n = Number.parseInt(match[1], 10);

            if(match[2] == 'cm') {
                return n >= 150 && n <= 193;
            } else {
                return n >= 59 && n <= 76;
            }
        }
        case 'hcl': return field.value.match(/^#[0-9a-f]{6}$/) != null;
        case 'ecl': return validEcl.has(field.value);
        case 'pid': return field.value.match(/^[0-9]{9}$/) != null;
        default: return true;
    }
}

function solvePart2(passports: Passport[]) {
    return passports.filter((passport) => hasRequiredFields(passport) && passport.fields.every(validateField)).length;
}
