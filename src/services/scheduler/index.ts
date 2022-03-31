import cron, { ScheduledTask } from 'node-cron'

const defaultCronDate: CroneDate = {
    minute: '*',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
}

function validate(cronExpression: string): boolean {
    return cron.validate(cronExpression)
}

function createCronExpression(date: Partial<CroneDate>): string {
    const  cronDate = {
        ...defaultCronDate,
        ...date,
    }

    return `${cronDate.minute} ${cronDate.hour} ${cronDate.dayOfMonth} ${cronDate.month} ${cronDate.dayOfWeek}`
}

function createTask(date: Partial<CroneDate>, cbFn: () => void): ScheduledTask | null {
    const cronExpression = createCronExpression(date)

    if (!validate(cronExpression)) {
        return null
    }

    return cron.schedule(cronExpression, cbFn)
}

function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function taskFnGenerator(numberOfTasks: number, dateGenerator: () => Partial<CroneDate>): Array<(fn: () => void) => ScheduledTask | null> {
    const taskFnArr = []
    
    for (let i = 0; i < numberOfTasks; i++) {
        const date = dateGenerator()
        taskFnArr.push((executableFn: () => void) => createTask(date, executableFn))
    }
    
    return taskFnArr
}

function createDaylyCronDate(fromHour: number,toHour: number): Partial<CroneDate> {
    const minute = randomNumber(0, 59).toString()
    const hour = randomNumber(fromHour, toHour).toString()

    return {
        minute,
        hour,
    }
}

function createDaylyCronDateFrom9To18(): () => Partial<CroneDate> {
    return () => createDaylyCronDate(9, 18)
}
