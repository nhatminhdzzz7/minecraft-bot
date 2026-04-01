const mc = require('minecraft-protocol');
const http = require('http');

http.createServer((req, res) => {
  res.end('Bot running');
}).listen(process.env.PORT || 8080);

const names = [
  'Steve_AFK', 'Alex_AFK', 'Notch_AFK', 'Player123',
  'Herobrine', 'CreeperBot', 'DiamondSteve', 'GoldAlex',
  'SkyBlock', 'NightBot', 'StarPlayer', 'MoonWalker'
];

function randomName() {
  return names[Math.floor(Math.random() * names.length)];
}

let botRunning = false;

function createBot() {
  if (botRunning) return;
  botRunning = true;

  const username = randomName();
  console.log(`🚀 Đang vào server với tên: ${username}`);

  let client;
  try {
    client = mc.createClient({
      host: 'aechat.aternos.me',
      port: 37480,
      username: username,
      version: '1.21.11',
      auth: 'offline',
      keepAlive: true,
      checkTimeoutInterval: 30000,
    });
  } catch (e) {
    console.log('❌ Không tạo được bot:', e.message);
    botRunning = false;
    setTimeout(createBot, 5000);
    return;
  }

  let pos = { x: 0, y: 64, z: 0 };
  let started = false;
  let teleportId = 0;

  // Keep alive - cực quan trọng
  client.on('keep_alive', (packet) => {
    try {
      client.write('keep_alive', { keepAliveId: packet.keepAliveId });
    } catch (e) {}
  });

  client.on('login', () => {
    console.log(`✅ Đã vào server với tên: ${username}`);
  });

  // Xác nhận teleport
  client.on('position', (packet) => {
    try {
      pos.x = packet.x;
      pos.y = packet.y;
      pos.z = packet.z;
      teleportId = packet.teleportId;
      client.write('teleport_confirm', { teleportId: teleportId });
      console.log(`📍 Vị trí: ${Math.round(pos.x)}, ${Math.round(pos.y)}, ${Math.round(pos.z)}`);
      if (!started) {
        started = true;
        startHumanLike(client, pos);
      }
    } catch (e) {}
  });

  // Xử lý chat server (login plugin)
  client.on('chat', (packet) => {
    try {
      const msg = packet.message || '';
      console.log('💬 Server:', msg);
      if (msg.includes('/login') || msg.toLowerCase().includes('login')) {
        client.write('chat', { message: '/login 123456' });
      }
      if (msg.includes('/register') || msg.toLowerCase().includes('register')) {
        client.write('chat', { message: '/register 123456 123456' });
      }
    } catch (e) {}
  });

  client.on('kicked', (reason) => {
    console.log('🚫 Bị kick:', JSON.stringify(reason));
    cleanup();
  });

  client.on('error', (err) => {
    console.log('❌ Lỗi:', err.message);
    cleanup();
  });

  client.on('end', () => {
    console.log('🔌 Mất kết nối');
    cleanup();
  });

  function cleanup() {
    botRunning = false;
    try { client.end(); } catch (e) {}
    console.log('⏳ Reconnect sau 5s...');
    setTimeout(createBot, 5000);
  }
}

function startHumanLike(client, pos) {
  console.log('🎮 Bắt đầu chế độ human-like...');

  // Gửi vị trí liên tục mỗi 1 giây (quan trọng nhất)
  const posInterval = setInterval(() => {
    try {
      client.write('position', {
        x: pos.x,
        y: pos.y,
        z: pos.z,
        onGround: true
      });
    } catch (e) {
      clearInterval(posInterval);
    }
  }, 1000);

  // Hành động random
  function loop() {
    const delay = 20000 + Math.random() * 40000; // 20s - 60s
    setTimeout(() => {
      try {
        const actions = ['move', 'look', 'swing', 'chat', 'idle', 'idle', 'idle'];
        const action = actions[Math.floor(Math.random() * actions.length)];

        if (action === 'move') {
          const dx = (Math.random() - 0.5) * 0.3;
          const dz = (Math.random() - 0.5) * 0.3;
          pos.x += dx;
          pos.z += dz;
          client.write('position', {
            x: pos.x,
            y: pos.y,
            z: pos.z,
            onGround: true
          });
          console.log('🚶 Di chuyển nhẹ');
        }

        if (action === 'look') {
          client.write('look', {
            yaw: Math.random() * 360,
            pitch: (Math.random() - 0.5) * 30,
            onGround: true
          });
          console.log('👀 Quay đầu');
        }

        if (action === 'swing') {
          client.write('arm_animation', { hand: 0 });
          console.log('👋 Vẫy tay');
        }

        if (action === 'chat') {
          const msgs = ['hi', 'ok', '...', 'hmm', 'lag k', 'ờ'];
          const msg = msgs[Math.floor(Math.random() * msgs.length)];
          client.write('chat', { message: msg });
          console.log('💬 Chat:', msg);
        }

        if (action === 'idle') {
          console.log('😴 Nghỉ...');
        }

      } catch (e) {
        console.log('⚠️ Lỗi action:', e.message);
      }
      loop();
    }, delay);
  }
  loop();
}

createBot();
