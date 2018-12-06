import { getInputLines } from "../../lib/user-input";
import { maxBy } from "../../lib/collections";

(async () => {
    const lines = await getInputLines(__dirname);

    const inputs = lines.map(parseLine);

    inputs.sort((a, b) => a.time.getTime() - b.time.getTime());

    const guards = logToGuards(inputs);

    const guard = maxBy(guards, guard => guard.countSleepingMinutes());

    console.log(guard.getMostSleepingMinute().minute * guard.id);

    const guardWithMaxSleepTimes = maxBy(guards, guard => guard.getMostSleepingMinute().sleepTimes);

    console.log(guardWithMaxSleepTimes.id * guardWithMaxSleepTimes.getMostSleepingMinute().minute);
})();

interface LogLine {
    time: Date;
    event: LogEvent;
}

type LogEvent = {
    type: 'FALLS_ASLEEP' | 'WAKES_UP';
} | {
    type: 'BEGINS_SHIFT';
    guardNumber: number;
};

function logToGuards(logs: LogLine[]): Guard[] {
    const guards = new Map<number, Guard>();

    let currentShift: Shift | null = null;
    let sleepingSince: number | null = null;

    for(const logLine of logs) {
        if(logLine.event.type === 'BEGINS_SHIFT') {
            currentShift = new Shift();

            let guard = guards.get(logLine.event.guardNumber) || new Guard(logLine.event.guardNumber);
            guard.addShift(currentShift);
            guards.set(logLine.event.guardNumber, guard);
        } else if(logLine.event.type === 'FALLS_ASLEEP') {
            sleepingSince = logLine.time.getMinutes();
        } else if(logLine.event.type === 'WAKES_UP') {
            if(currentShift == null || sleepingSince == null) throw new Error();
            currentShift!.addSleepingMinutes(sleepingSince!, logLine.time.getMinutes() - 1);
        }
    }

    return Array.from(guards.values());
}

class Guard {
    private readonly shifts: Shift[] = [];
    constructor(public id: number) {}

    addShift(shift: Shift) {
        this.shifts.push(shift);
    }

    countSleepingMinutes() {
        return this.shifts.reduce((acc, shift) => shift.countSleepingMinutes() + acc, 0);
    }

    getMostSleepingMinute(): { minute: number, sleepTimes: number } {
        // Map between minute number and the number of times they've slept that minute
        const sleepingCount = new Map<number, number>();

        for(const shift of this.shifts) {
            for(const minute of shift.getSleepingMinutes()) {
                sleepingCount.set(minute, (sleepingCount.get(minute) || 0) + 1);
            }
        }

        if(sleepingCount.size === 0) {
            return { minute: 1, sleepTimes: 0 };
        }

        return maxBy(
            Array.from(sleepingCount).map(([minute, sleepTimes]) => ({ minute, sleepTimes })),
            ({ minute, sleepTimes }) => sleepTimes,
        );
    }
}

class Shift {
    private sleepingMinutes = new Set<number>();

    addSleepingMinutes(startMinute: number, endMinute: number) {
        for(let i = startMinute; i <= endMinute; i++) {
            this.sleepingMinutes.add(i);
        }
    }

    countSleepingMinutes(): number {
        return this.sleepingMinutes.size;
    }

    getSleepingMinutes(): IterableIterator<number> {
        return this.sleepingMinutes.values();
    }
}

/*
[1518-07-10 00:00] Guard #761 begins shift
[1518-10-09 00:43] wakes up
[1518-10-12 00:35] falls asleep
*/
function parseLine(line: string): LogLine {
    const match = line.match(/^\[(.*?)\] (.*?)$/);
    if(!match) throw new Error('cannot find match');

    let event: LogEvent;

    const rawEvent = match[2];

    if(rawEvent === 'wakes up') {
        event = {
            type: 'WAKES_UP',
        };
    } else if(rawEvent === 'falls asleep') {
        event = {
            type: 'FALLS_ASLEEP',
        };
    } else {
        const match = rawEvent.match(/Guard #(\d+) begins shift/);
        if(!match) throw new Error('cannot find match');

        event = {
            type: 'BEGINS_SHIFT',
            guardNumber: Number.parseInt(match[1]),
        };
    }

    return {
        time: new Date(match[1]),
        event,
    };
}
