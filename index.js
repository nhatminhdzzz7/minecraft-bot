const mc = require('minecraft-protocol');
const http = require('http');

http.createServer((req, res) => {
  res.write('Bot running!');
  res.end();
}).listen(8080);

let delay = 5000;

function createBot() {
  const client = mc.createClient({
    host: 'aechat.aternos.me',
    port: 37480,
    username: 'TenBot_' + Math.floor(Math.random() * 1000), // random tên
    version: false,
    auth: 'offline'
  });

  client.on('login', () => {
    console.log('✅ Bot đã vào server!');

    // Delay để tránh bị nghi spam
    setTimeout(() => {
      client.write('chat', { message: '/login matkhau' });
    }, 5000);

    // Chat random như người thật
    setInterval(() => {
      const msgs = ['hello', 'hi', 'afk xíu', 'server lag v', 'ok'];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      client.write('chat', { message: msg });
    }, 60000 + Math.random() * 30000); // 60-90s

    // Anti AFK: nhảy nhẹ
    setInterval(() => {
      client.write('entity_action', {
        entityId: client.entityId,
        actionId: 1, // jump
        jumpBoost: 1
      });
    }, 15000);
  });

  client.on('kicked', (reason) => {
    console.log('⚠️ Bị kick:', reason);
    reconnect();
  });

  client.on('error', (err) => {
    console.log('❌ Lỗi:', err.message);
    reconnect();
  });

  client.on('end', () => {
    console.log('🔌 Mất kết nối...');
    reconnect();
  });
}

function reconnect() {
  setTimeout(createBot, delay);
  delay = Math.min(delay + 3000, 60000); // tăng delay để tránh spam
}

createBot();
