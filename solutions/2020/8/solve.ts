import { puzzle } from "../../../lib/puzzle";
import { getInputLines } from "../../../lib/user-input";

export default puzzle(async () => {
    const instructions = parseInput(await getInputLines(__dirname));
    
    return {
        part1: solvePart1(instructions),
        part2: solvePart2(instructions),
    };
});

type InstructionType = 'nop' | 'acc' | 'jmp';

interface Instruction {
    type: InstructionType;
    arg: number;
}

function parseInput(lines: string[]): Instruction[] {
    return lines.map(line => {
        const match = line.match(/^(nop|acc|jmp) ([-+]\d+)$/);

        if(!match) throw new Error('No match');

        return {
            type: match[1] as InstructionType,
            arg: Number.parseInt(match[2], 10),
        };
    });
}

function solvePart1(instructions: Instruction[]) {
    return evaluateInstructions(instructions).accumulator;
}

function solvePart2(instructions: Instruction[]) {
    for(const modifiedInstructions of allInstructions(instructions)) {
        const result = evaluateInstructions(modifiedInstructions);

        if(result.type === 'last-instruction') {
            return result.accumulator;
        }
    }

    throw new Error('Could not find a modification that results in the last instruction being executed');
}

interface EvalResult {
    type: 'loop' | 'last-instruction' | 'out-of-bounds';
    accumulator: number;
}

function evaluateInstructions(instructions: Instruction[]): EvalResult {
    let accumulator = 0;
    let instructionPointer = 0;
    let executedInstructionIndicies = new Set<number>();

    while(true) {
        if(instructionPointer === instructions.length) {
            return {
                type: 'last-instruction',
                accumulator,
            };
        }

        if(instructionPointer > instructions.length) {
            return {
                type: 'out-of-bounds',
                accumulator,
            };
        }

        if(executedInstructionIndicies.has(instructionPointer)) {
            return {
                type: 'loop',
                accumulator,
            };
        }

        executedInstructionIndicies.add(instructionPointer);

        const instruction = instructions[instructionPointer];

        switch(instruction.type) {
            case 'acc':
                accumulator += instruction.arg;
                instructionPointer += 1;
                break;
            case 'jmp':
                instructionPointer += instruction.arg;
                break;
            case 'nop':
                instructionPointer += 1;
                break;
        }
    }
}

function* allInstructions(instructions: Instruction[]) {
    for(let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];

        if(instruction.type === 'jmp' || instruction.type === 'nop') {
            const updatedInstructions = [...instructions];
            updatedInstructions[i] = {
                type: instruction.type === 'jmp' ? 'nop' : 'jmp',
                arg: instruction.arg,
            };
            yield updatedInstructions;
        }
    }
}
