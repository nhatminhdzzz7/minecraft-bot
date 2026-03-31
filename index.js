const mc = require('minecraft-protocol');
const http = require('http');

http.createServer((req, res) => {
  res.end('Bot running!');
}).listen(process.env.PORT || 8080);

let delay = 5000;

function createBot() {
  const client = mc.createClient({
    host: 'aechat.aternos.me',
    port: 25565,
    username: 'TenBot_' + Math.floor(Math.random() * 9999),
    version: false,
    auth: 'offline'
  });

  client.on('login', () => {
    console.log('✅ Bot đã vào server!');

    // Delay login tránh bị anti-bot
    setTimeout(() => {
      client.write('chat', { message: '/login matkhau' });
    }, 4000);

    // Di chuyển nhẹ (anti AFK)
    setInterval(() => {
      const x = (Math.random() - 0.5) * 0.2;
      const z = (Math.random() - 0.5) * 0.2;

      client.write('position', {
        x: client.entity.position.x + x,
        y: client.entity.position.y,
        z: client.entity.position.z + z,
        onGround: true
      });
    }, 10000);

    // Xoay đầu random (giống người thật)
    setInterval(() => {
      client.write('look', {
        yaw: Math.random() * 360,
        pitch: (Math.random() * 180) - 90,
        onGround: true
      });
    }, 8000);

    // Chat random (chậm, không spam)
    setInterval(() => {
      const msgs = [
        'hello',
        'lag v',
        'afk tí',
        'ok',
        'ai chơi ko'
      ];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      client.write('chat', { message: msg });
    }, 90000 + Math.random() * 60000); // 90–150s
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
  delay = Math.min(delay + 3000, 60000);
}

createBot();
