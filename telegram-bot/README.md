# Telegram Mini App Bot

## 1) Prepare environment

Copy example file and add your fresh token:

```bash
cp telegram-bot/.env.example telegram-bot/.env
```

Set values in `telegram-bot/.env`:

- `BOT_TOKEN` - token from BotFather
- `MINI_APP_URL` - your HTTPS mini app URL

## 2) Run bot

```bash
npm run bot:start
```

For auto-reload during edits:

```bash
npm run bot:dev
```

## 3) BotFather setup

Use these commands in BotFather:

- `/setdomain` -> `sport-empire.kz`
- `/setmenubutton` -> text: `Open Sport Empire`, URL: `https://sport-empire.kz/`

Then open your bot in Telegram and press `Start`.
