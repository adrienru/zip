const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

console.log('🛠 Verificando entorno...\n');

// 1. Verificar si Node.js y npm están instalados
exec('node -v', (err, stdout) => {
  if (err) return console.error('❌ Node.js no está disponible.');
  console.log('✅ Node.js:', stdout.trim());

  exec('npm -v', (err, stdout) => {
    if (err) return console.error('❌ npm no está disponible.');
    console.log('✅ npm:', stdout.trim());

    // 2. Verificar si el archivo .config.yaml existe
    const configPath = path.resolve(__dirname, 'terabox-node/.config.yaml');
    if (fs.existsSync(configPath)) {
      console.log('✅ .config.yaml encontrado');
    } else {
      console.error('❌ .config.yaml no encontrado en: ' + configPath);
    }

    // 3. Probar un comando tb-check
    console.log('\n▶ Ejecutando prueba: tb-check...');
    exec('node terabox-node/app/tb-check.js', (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Error al ejecutar tb-check:\n', stderr);
      } else {
        console.log('✅ tb-check ejecutado con éxito:\n', stdout);
      }
    });
  });
});
