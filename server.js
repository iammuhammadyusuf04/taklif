const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

function clean(value, max = 200) {
  return String(value ?? "").trim().slice(0, max);
}
function escapeHtml(value) {
  return clean(value).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

app.post("/api/booking", async (req, res) => {
  try {
    const place = clean(req.body.place);
    const restaurant = clean(req.body.restaurant);
    const date = clean(req.body.date);
    const time = clean(req.body.time);
    const companion = clean(req.body.companion);

    if (!restaurant || !date || !time) {
      return res.status(400).json({ ok: false, message: "Booking ma'lumotlari to'liq emas." });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({ ok: false, message: "Telegram sozlamalari topilmadi." });
    }

    const message =
`💌 <b>Yangi uchrashuv tanlovi!</b>

📍 <b>Joy:</b> ${escapeHtml(place === "Park" ? "Park → Restoran" : "Restoran")}
🍽 <b>Restoran:</b> ${escapeHtml(restaurant)}
📅 <b>Sana:</b> ${escapeHtml(date)}
⏰ <b>Vaqt:</b> ${escapeHtml(time)}
👯 <b>Hamroh:</b> ${escapeHtml(companion || "Ko'rsatilmagan")}

❤️ <i>Uchrashuv taklifi qabul qilindi!</i>`;

    const url = `https://api.telegram.org/bot${encodeURIComponent(botToken)}/sendMessage`;
    const tg = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });

    const result = await tg.json();
    if (!tg.ok || !result.ok) {
      console.error("Telegram API error:", result);
      return res.status(502).json({ ok: false, message: "Telegramga yuborishda xatolik." });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ ok: false, message: "Server xatosi." });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true, service: "date-invite-backend" }));

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => console.log(`Date invite server running on port ${PORT}`));

