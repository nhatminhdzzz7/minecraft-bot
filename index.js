const http = require('http');
http.createServer((req, res) => {
  res.write('Bot đang chạy!');
  res.end();
}).listen(8080);
const mineflayer = require('mineflayer');

const config = {
  host: 'aechat.aternos.me',
  port: 37480,
  username: '24/7',
  version: '1.21.11',
};

function createBot() {
  const bot = mineflayer.createBot(config);

  bot.on('login', () => {
    console.log('✅ Bot đã vào server!');
  });

  bot.on('spawn', () => {
    console.log('📍 Bot đã spawn!');
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 30000);
    setInterval(() => {
      bot.look(bot.entity.yaw + 0.5, 0, false);
    }, 10000);
  });

  bot.on('kicked', (reason) => {
    console.log(`⚠️ Bị kick: ${reason}`);
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log(`❌ Lỗi: ${err.message}`);
    setTimeout(createBot, 5000);
  });

  bot.on('end', () => {
    console.log('🔌 Mất kết nối, reconnect...');
    setTimeout(createBot, 5000);
  });
}