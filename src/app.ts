import cron from 'node-cron'
import { Telegram, Telegraf } from 'telegraf'

import { botSignature } from './consts'
import { getRequest, HttpRequest } from './transport/httpRequest'

const telegram: Telegram = new Telegram(process.env.BOT_TOKEN as string)
const bot = new Telegraf(process.env.BOT_TOKEN as string)
const req = new HttpRequest()

cron.schedule('0 9 * * 2,5', () => {
    telegram.sendMessage(
        process.env.CHAT_ID as string,
        'Привет! Я буду иногда напоминать полить нашего друга, а именно вт/пт в 11:00. Большое спасибо, что проявляешь заботу о нём, я это очень ценю. Хорошего тебе вечера ;)'
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
