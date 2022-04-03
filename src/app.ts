import cron from 'node-cron'
import { Telegram, Telegraf } from 'telegraf'

import { botSignature, daylyTasksCount, scheduledReminderMessage } from './consts'
import { createDaylyCronDateFrom9To18, createDaylyCronTasks } from './services/scheduler'
import { getRequest, HttpRequest } from './transport/httpRequest'

const telegram: Telegram = new Telegram(process.env.BOT_TOKEN as string)
const bot = new Telegraf(process.env.BOT_TOKEN as string)
const req = new HttpRequest()

cron.schedule('0 9 * * 2,5', () => {
    telegram.sendMessage(
        process.env.CHAT_ID as string,
        scheduledReminderMessage
    )
})

createDaylyCronTasks(daylyTasksCount, createDaylyCronDateFrom9To18, async () => {
    const catAnimation = await getRequest(req, 'cataas.com', '/cat/gif')

    telegram.sendAnimation(
        process.env.CHAT_ID as string,
        catAnimation
    )
})

bot.on('message', async (ctx, next) => {
    try {
        const id = Number(process.env.TRACKED_MEMBER_ID)

        if (ctx.update.message.from.id === 200484588) {
            const catAnimation = await getRequest(req, 'cataas.com', '/cat/gif')

            telegram.sendAnimation(
                process.env.CHAT_ID as string,
                catAnimation
            )
        }

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
