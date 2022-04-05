type CroneDate = {
    minute: string;
    hour: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
}

type ScheduledTaskNameReminder = 'reminder'
type ScheduledTaskNamePicture = 'picture'
type ScheduledTaskName = ScheduledTaskNameReminder | ScheduledTaskNamePicture