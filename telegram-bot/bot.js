import dotenv from 'dotenv';
import { Telegraf, Markup } from 'telegraf';
import { fileURLToPath } from 'url';

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) });

const botToken = process.env.BOT_TOKEN;
const miniAppUrl = process.env.MINI_APP_URL || 'https://sport-empire.kz/';

if (!botToken) {
  throw new Error('BOT_TOKEN is missing. Add it to .env before running the bot.');
}

const bot = new Telegraf(botToken);

const openAppKeyboard = Markup.inlineKeyboard([
  Markup.button.webApp('Otkryt Sport Empire', miniAppUrl)
]);

bot.start(async (ctx) => {
  await ctx.reply(
    'Dobro pozhalovat v Sport Empire.\n\n' +
      'Nazhmi knopku nizhe, chtoby otkryt mini app v Telegram.',
    openAppKeyboard
  );
});

bot.command('app', async (ctx) => {
  await ctx.reply('Otkryt mini app:', openAppKeyboard);
});

bot.launch();
console.log(`Telegram bot is running. Mini App URL: ${miniAppUrl}`);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
