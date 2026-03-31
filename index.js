const mc = require('minecraft-protocol');
const http = require('http');

const PORT = process.env.PORT || 8080;

// Web server giữ Railway sống
http.createServer((req, res) => {
  res.end('Bot is running!');
}).listen(PORT);

let delay = 5000;

function createBot() {
  console.log('🚀 Đang tạo bot...');

  const client = mc.createClient({
    host: 'aechat.aternos.me', // đổi nếu cần
    port: 25565,
    username: 'TenBot_' + Math.floor(Math.random() * 9999),
    version: false,
    auth: 'offline'
  });

  client.on('login', () => {
    console.log('✅ Bot đã vào server!');

    // Delay để tránh anti-bot
   

  setTimeout(() => {
    try {
      const actions = ['swing', 'chat', 'nothing'];
      const action = actions[Math.floor(Math.random() * actions.length)];

      if (action === 'swing') {
        client.write('arm_animation', { hand: 0 });
        console.log('👋 vẫy tay');
      }

      if (action === 'chat') {
        const msgs = ['hi', 'alo', 'nam', 'minhdz', 't can ca server'];
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        client.write('chat', { message: msg });
        console.log('💬 chat:', msg);
      }

      // có lúc không làm gì → giống người thật
    } catch {}

    randomAction(client); // loop tiếp
  }, delay);
}

    // Ping nhẹ để giữ kết nối (an toàn hơn movement)
    setInterval(() => {
      try {
        client.write('keep_alive', { keepAliveId: Date.now() });
      } catch {}
    }, 20000);
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
  console.log('⏳ Đang reconnect sau', delay / 1000, 'giây...');
  setTimeout(createBot, delay);
  delay = Math.min(delay + 3000, 60000);
}

createBot();
