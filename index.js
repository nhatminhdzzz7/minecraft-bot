const mc = require('minecraft-protocol');
const http = require('http');

// giữ Railway sống
http.createServer((req, res) => {
  res.end('Bot running');
}).listen(process.env.PORT || 8080);

let delay = 5000;

function createBot() {
  console.log('🚀 Đang kết nối...');

  const client = mc.createClient({
    host: 'aechat.aternos.me', // đổi IP nếu cần
    port: 37480,
    username: 'Dream',
    version: false,
    auth: 'offline'
  });

  client.on('login', () => {
    console.log('✅ Đã vào server');

    // chỉ chat rất ít (tránh bị detect)
    setInterval(() => {
      try {
        client.write('chat', { message: 'hi' });
      } catch {}
    }, 180000); // 3 phút
  });

  client.on('kicked', (reason) => {
    console.log('🚫 Bị kick:', reason);
    reconnect();
  });

  client.on('error', (err) => {
    console.log('❌ Lỗi:', err.message);
    reconnect();
  });

  client.on('end', () => {
    console.log('🔌 Mất kết nối');
    reconnect();
  });
}

function reconnect() {
  console.log('⏳ Reconnect sau', delay / 1000, 'giây...');
  setTimeout(createBot, delay);
  delay = Math.min(delay + 3000, 60000);
}

createBot();
