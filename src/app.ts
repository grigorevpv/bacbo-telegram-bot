import { Telegram, Telegraf } from 'telegraf'

import {
    botSignature,
    catPhotoUrl,
    daylyTasksCount,
    defaultTextLength,
    defaultTextSize,
    reminderTasksCount,
    scheduledReminderMessage,
    scheduledTasksPicture,
    scheduledTasksReminder,
} from './consts'
import { createDaylyCronDateFrom9To18, createCronTasks } from './services/scheduler'
import { getRequest, HttpRequest } from './transport/httpRequest'
import { getTextSize } from './utils/text'

const telegram: Telegram = new Telegram(process.env.BOT_TOKEN as string)
const bot = new Telegraf(process.env.BOT_TOKEN as string)
const req = new HttpRequest()

createCronTasks(
    reminderTasksCount,
    scheduledTasksReminder,
    () => ({minute: '0', hour: '8', dayOfWeek: '2,5'}),
    () => {
        telegram.sendMessage(
            process.env.CHAT_ID as string,
            scheduledReminderMessage
        )
    }
)

createCronTasks(daylyTasksCount, scheduledTasksPicture, createDaylyCronDateFrom9To18, async () => {
    const { compliment } = await getRequest(req, 'complimentr.com', '/api')
    const complimentWithSignature = `${compliment}. ${botSignature}`
    const textSize = getTextSize(complimentWithSignature, defaultTextLength, defaultTextSize)

    telegram.sendPhoto(
        process.env.CHAT_ID as string,
        { url: `${catPhotoUrl}/says/${complimentWithSignature}?size=${textSize}` }
    )
})

bot.on('message', async (ctx, next) => {
    try {
        const id = Number(process.env.TRACKED_MEMBER_ID)

        if (ctx.update.message.from.id === id) {
            const { compliment } = await getRequest(req, 'complimentr.com', '/api')
            const complimentWithSignature = `${compliment}. ${botSignature}`

            telegram.sendMessage(
                process.env.CHAT_ID as string,
                complimentWithSignature
            )
        }
    } catch (e) {
        console.error(e)
    }

    return next()
})

bot.launch()
