import cron from 'node-cron';
import { Telegram } from 'telegraf';

const telegram: Telegram = new Telegram(process.env.BOT_TOKEN as string);

cron.schedule("15 15 * * 2,4", () => {
    telegram.sendMessage(
        process.env.CHAT_ID as string,
        'Привет! Я буду иногда напоминать полить нашего друга, а именно пн/чт в 17:00. Большое спасибо, что проявляешь заботу о нём, я это очень ценю. Хорошего тебе вечера ;)'
    );
});
