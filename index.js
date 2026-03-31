const mc = require('minecraft-protocol');
const http = require('http');

http.createServer((req, res) => {
  res.write('Bot running!');
  res.end();
}).listen(8080);

function createBot() {
  const client = mc.createClient({
    host: 'aechat.aternos.me',
    port: 37480,
    username: 'TenBot',
    version: '1.21.11',
    auth: 'offline'
  });

  client.on('login', () => {
    console.log('✅ Bot đã vào server!');
  });

  client.on('kicked', (reason) => {
    console.log('⚠️ Bị kick:', reason);
    setTimeout(createBot, 5000);
  });

  client.on('error', (err) => {
    console.log('❌ Lỗi:', err.message);
    setTimeout(createBot, 5000);
  });

  client.on('end', () => {
    console.log('🔌 Mất kết nối, reconnect...');
    setTimeout(createBot, 5000);
  });
}

createBot();
