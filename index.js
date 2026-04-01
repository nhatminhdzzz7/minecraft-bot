const mc = require('minecraft-protocol');
const http = require('http');

http.createServer((req, res) => {
  res.end('Bot running');
}).listen(process.env.PORT || 8080);

function createBot() {
  console.log('🚀 Đang vào server...');

  const client = mc.createClient({
    host: 'aechat.aternos.me',
    port: 25565,
    username: 'TenBot',
    version: false,
    auth: 'offline'
  });

  let pos = { x: 0, y: 0, z: 0 };

  client.on('login', () => {
    console.log('✅ Đã vào server');

    // bắt vị trí
    client.on('position', (packet) => {
      pos.x = packet.x;
      pos.y = packet.y;
      pos.z = packet.z;
    });

    startHumanLike(client, pos);
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
  console.log('⏳ Reconnect 5s...');
  setTimeout(createBot, 5000);
}

function startHumanLike(client, pos) {
  function loop() {
    const delay = 15000 + Math.random() * 30000; // 15s → 45s

    setTimeout(() => {
      try {
        const actions = ['move', 'look', 'chat', 'swing', 'idle'];
        const action = actions[Math.floor(Math.random() * actions.length)];

        // 🚶 di chuyển nhẹ (QUAN TRỌNG)
        if (action === 'move') {
          const dx = (Math.random() - 0.5) * 1;
          const dz = (Math.random() - 0.5) * 1;

          client.write('position', {
            x: pos.x + dx,
            y: pos.y,
            z: pos.z + dz,
            onGround: true
          });

          console.log('🚶 di chuyển');
        }

        // 👀 quay đầu
        if (action === 'look') {
          client.write('look', {
            yaw: Math.random() * 360,
            pitch: (Math.random() - 0.5) * 60,
            onGround: true
          });

          console.log('👀 quay đầu');
        }

        // 👋 vẫy tay
        if (action === 'swing') {
          client.write('arm_animation', { hand: 0 });
          console.log('👋 vẫy tay');
        }

        // 💬 chat random
        if (action === 'chat') {
          const msgs = ['hi', '.', 'ok', 'lag', 'hmm'];
          const msg = msgs[Math.floor(Math.random() * msgs.length)];
          client.write('chat', { message: msg });
          console.log('💬 chat:', msg);
        }

        // idle (có lúc không làm gì)
      } catch (e) {
        console.log('⚠️ lỗi action:', e.message);
      }

      loop(); // lặp tiếp
    }, delay);
  }

  loop();
}

createBot();
