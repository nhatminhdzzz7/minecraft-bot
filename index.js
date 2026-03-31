const mc = require('minecraft-protocol');
const http = require('http');

http.createServer((req, res) => {
  res.end('Bot running');
}).listen(process.env.PORT || 8080);

function createBot() {
  const client = mc.createClient({
    host: 'aechat.aternos.me',
    port: 25565,
    username: 'TenBot',
    version: false,
    auth: 'offline'
  });

  client.on('login', () => {
    console.log('✅ Đã vào server');
    randomAction(client);
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
  setTimeout(createBot, 5000);
}

function randomAction(client) {
  const delay = 20000 + Math.random() * 40000;

  setTimeout(() => {
    try {
      const actions = ['swing', 'chat', 'nothing'];
      const action = actions[Math.floor(Math.random() * actions.length)];

      if (action === 'swing') {
        client.write('arm_animation', { hand: 0 });
        console.log('👋 vẫy tay');
      }

      if (action === 'chat') {
        const msgs = ['hi', 't can ca sever', 'ok', 'nam', 'minh'];
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        client.write('chat', { message: msg });
        console.log('💬 chat:', msg);
      }

    } catch (e) {
      console.log('⚠️ lỗi action:', e.message);
    }

    randomAction(client);
  }, delay);
}

createBot();
