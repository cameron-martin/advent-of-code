import { getInputLines } from "../../lib/user-input";
import { minBy } from "../../lib/collections";

(async () => {
    const lines = await getInputLines(__dirname);

    const taskDepdendencies = lines.map(parseLine);

    solvePart1(taskDepdendencies);
    solvePart2(taskDepdendencies);
})();

function solvePart1(taskDepdendencies: TaskDependency[]) {
    const tasks1 = Tasks.fromDependencies(taskDepdendencies);

    const sorted = [];

    while(!tasks1.allCompleted()) {
        const task = tasks1.getNextAvailableTask()!;

        sorted.push(task);
        task.finish();
    }

    console.log(sorted.map(task => task.id).join(""));
}

function solvePart2(taskDepdendencies: TaskDependency[]) {
    const tasks = Tasks.fromDependencies(taskDepdendencies);

    const taskRunner = new TaskRunner(5, tasks);

    taskRunner.run();

    console.log(taskRunner.time);
}

interface TaskDependency {
    task: string;
    prerequisite: string;
}

function parseLine(line: string): TaskDependency {
    const match = line.match(/^Step ([A-Z]) must be finished before step ([A-Z]) can begin.$/);
    if(!match) throw new Error();

    return { prerequisite: match[1], task: match[2] };
}

class TaskRunner {
    public time = 0;

    constructor(private poolSize: number, private tasks: Tasks) {}

    run() {
        this.fillPool();

        while(!this.tasks.allCompleted()) {
            const tasks = this.tasks.getRunningTasks();

            const stepAmount = minBy(tasks, task => task.timeRemaining).timeRemaining;

            for(const task of tasks) {
                task.stepTime(stepAmount);
            }

            this.time += stepAmount;

            this.fillPool();
        }
    }

    fillPool() {
        while(this.tasks.countByState('running') < this.poolSize) {
            const task = this.tasks.getNextAvailableTask();

            if(!task) break;

            task.start();
        }
    }
}

type TaskState = 'pending' | 'running' | 'completed';

class Task {
    private _state: TaskState = 'pending';
    private _timeRemaining: number;

    constructor(public readonly id: string) {
        this._timeRemaining = this.completionTime;
    }

    get state() {
        return this._state;
    }

    get completionTime() {
        return this.id.charCodeAt(0) - "A".charCodeAt(0) + 61;
    }

    get timeRemaining() {
        return this._timeRemaining;
    }

    stepTime(amount: number) {
        this._timeRemaining = Math.max(0, this._timeRemaining - amount);

        if(this._timeRemaining === 0) {
            this._state = 'completed';
        }
    }

    start() {
        this._state = 'running';
    }

    finish() {
        this._state = 'completed';
        this._timeRemaining = 0;
    }
}

class Tasks {
    static fromDependencies(deps: TaskDependency[]) {
        const tasks = new Map<string, Task>();
        const prerequisites = new Map<Task, Set<Task>>();

        for(const dep of deps) {
            if(!tasks.has(dep.task)) tasks.set(dep.task, new Task(dep.task));
            if(!tasks.has(dep.prerequisite)) tasks.set(dep.prerequisite, new Task(dep.prerequisite));

            const task = tasks.get(dep.task)!;
            const prerequisite = tasks.get(dep.prerequisite)!;

            if(!prerequisites.has(task)) prerequisites.set(task, new Set());

            prerequisites.get(task)!.add(prerequisite);
        }

        return new Tasks(tasks, prerequisites);
    }

    private constructor(private tasks: Map<string, Task>, private prerequisites: Map<Task, Set<Task>>) {}

    getRunningTasks(): Task[] {
        return Array.from(this.tasks.values()).filter(task => task.state === 'running');
    }

    allCompleted() {
        return this.countByState('completed') === this.tasks.size;
    }

    countByState(state: TaskState) {
        let count = 0;

        for(const task of this.tasks.values()) {
            if(task.state === state) count++;
        }

        return count;
    }

    getNextAvailableTask(): Task | null {
        const tasks = this.getAvailableTasks();

        tasks.sort((a, b) => a.id.charCodeAt(0) - b.id.charCodeAt(0));

        return tasks[0] || null;
    }

    private getAvailableTasks(): Task[] {
        const result = [];

        for(const task of this.tasks.values()) {
            if(task.state !== 'pending') continue;

            const prerequisites = this.prerequisites.get(task);

            if(!prerequisites || Array.from(prerequisites).every(task => task.state === 'completed')) {
                result.push(task);
            }
        }
        return result;
    }
}
