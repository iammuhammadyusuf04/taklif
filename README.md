# Uchrashuv taklifi — Backend 💌

Frontend yakuniy tanlovni `POST /api/booking` orqali backendga yuboradi. Backend Telegram Bot API orqali sizga xabar jo'natadi.

## Ishga tushirish
1. Node.js 18+ o'rnating.
2. `npm install`
3. `.env.example` ni `.env` qilib, `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` ni kiriting.
4. Telegram botga `/start` yuboring.
5. `npm start`
6. `http://localhost:3000`

Bot tokeni frontendda saqlanmaydi.

## Telegram
BotFather'dan bot yarating. `TELEGRAM_BOT_TOKEN` — bot tokeni.
`TELEGRAM_CHAT_ID` — xabar boradigan shaxsiy chat ID.

## API
`POST /api/booking`:
`place`, `restaurant`, `date`, `time`, `companion`.

`GET /health` serverni tekshiradi.
