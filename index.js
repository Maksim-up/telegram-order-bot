const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;

const bot = new TelegramBot(token, { polling: true });

const userSessions = {};

bot.on('message', (msg) => {
  const userId = msg.from.id;
  const text = msg.text;

  if (!userSessions[userId]) {
    userSessions[userId] = { step: 0, data: {} };
    bot.sendMessage(userId, '👤 Введите ваше имя:');
    return;
  }

  const session = userSessions[userId];

  switch (session.step) {
    case 0:
      session.data.name = text;
      bot.sendMessage(userId, '📞 Введите ваш номер телефона:');
      session.step++;
      break;
    case 1:
      session.data.phone = text;
      bot.sendMessage(userId, '👟 Какой товар вы хотите заказать?');
      session.step++;
      break;
    case 2:
      session.data.product = text;
      bot.sendMessage(userId, '📏 Укажите размер товара:');
      session.step++;
      break;
    case 3:
      session.data.size = text;
      bot.sendMessage(userId, '📍 Укажите ваш город:');
      session.step++;
      break;
    case 4:
      session.data.city = text;
      bot.sendMessage(userId, '🏠 Введите адрес доставки:');
      session.step++;
      break;
    case 5:
      session.data.address = text;

      const order = session.data;

      const message =
        `📦 Новый заказ\n` +
        `👤 Имя: ${order.name}\n` +
        `📞 Телефон: ${order.phone}\n` +
        `👟 Товар: ${order.product}\n` +
        `📏 Размер: ${order.size}\n` +
        `📍 Город: ${order.city}\n` +
        `🏠 Адрес: ${order.address}`;

      // Отправка владельцу (тебе)
      bot.sendMessage(chatId, message);

      // Подтверждение пользователю
      bot.sendMessage(userId, '✅ Ваш заказ принят! Мы свяжемся с вами.');

      // Очистка сессии
      delete userSessions[userId];
      break;
  }
});
