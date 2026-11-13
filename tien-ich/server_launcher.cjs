const { spawn, exec } = require('child_process');
const path = require('path');
const http = require('http');

console.log('========================================================');
console.log('  KHOI DONG HE THONG TRA CUU DIA CHINH VIET NAM 2026');
console.log('  Nghi quyet so 202/2025/QH15');
console.log('========================================================\n');

// Project root = parent folder of "tien-ich"
const projectDir = path.join(__dirname, '..');

// 1. Start Python bridge proxy
const pyScript = path.join(projectDir, 'server', 'py_bridge.py');
const py = spawn('python', [pyScript], { shell: true, stdio: 'ignore', detached: true });
py.unref();

// 2. Start TypeScript Express backend server
const srvScript = path.join('server', 'server.ts');
const srv = spawn('npx tsx watch ' + srvScript, {
  shell: true,
  cwd: projectDir,
  stdio: 'inherit'
});

srv.on('error', (err) => {
  console.error('[LOI KHOI DONG SERVER]:', err.message);
});

// 3. Poll until server is ready, then automatically open browser
let opened = false;
let attempts = 0;

function checkReady() {
  attempts++;
  if (attempts > 30) {
    console.log('[THONG BAO] Da het thoi gian cho. Ban co the truy cap bang tay tai: http://localhost:3000');
    return;
  }

  const req80 = http.get('http://localhost/', (res) => {
    if (!opened) {
      opened = true;
      console.log('\n>>> HE THONG DA SAN SANG! DANG TU DONG MO TRINH DUYET: http://localhost');
      exec('start http://localhost');
    }
  });

  req80.on('error', () => {
    const req3000 = http.get('http://localhost:3000/', (res) => {
      if (!opened) {
        opened = true;
        console.log('\n>>> HE THONG DA SAN SANG TAI: http://localhost:3000');
        exec('start http://localhost:3000');
      }
    });
    req3000.on('error', () => {
      setTimeout(checkReady, 800);
    });
  });
}

setTimeout(checkReady, 1000);
