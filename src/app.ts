import cron from 'node-cron'
import { Telegram, Telegraf } from 'telegraf'

import { botSignature } from './consts'
import { phrases } from './phrases'

const telegram: Telegram = new Telegram(process.env.BOT_TOKEN as string)
const bot = new Telegraf(process.env.BOT_TOKEN as string)

cron.schedule('0 7 * * 1,4', () => {
    telegram.sendMessage(
        process.env.CHAT_ID as string,
        'Привет! Я буду иногда напоминать полить нашего друга, а именно пн/чт в 17:00. Большое спасибо, что проявляешь заботу о нём, я это очень ценю. Хорошего тебе вечера ;)'
    )
})

bot.on('message', (ctx, next) => {
    try {
        const id = Number(process.env.TRACKED_MEMBER_ID)

        if (ctx.update.message.from.id === id) {
            const phraseId = Math.ceil((Math.random() * 10) % phrases.length)
            const phrase = `${phrases[phraseId]} ${botSignature}`

            telegram.sendMessage(
                process.env.CHAT_ID as string,
                phrase
            )
        }
    } catch (e) {
        console.error(e)
    }

    return next()
})

bot.launch()
