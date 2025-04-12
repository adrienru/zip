// crear-scripts-terabox.js
const fs = require('fs');
const path = require('path');

const binDir = path.join(__dirname, 'bin');
if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir);
}

const scripts = {
  'tb-check': 'app-check.js',
  'tb-upload': 'app-uploader.js',
  'tb-getdl': 'app-getdl.js',
  'tb-getdl-share': 'app-getdl-share.js',
  'tb-filemeta': 'app-filemeta.js',
  'tb-mkhash': 'app-mktbhash.js',
};

for (const [scriptName, targetFile] of Object.entries(scripts)) {
  const scriptPath = path.join(binDir, scriptName);
  const content = `#!/usr/bin/env node
require("../app/${targetFile}");
`;

  fs.writeFileSync(scriptPath, content, { mode: 0o755 });
  console.log(`✅ Creado: ${scriptName} -> ${targetFile}`);
}

console.log(`\n📂 Todos los scripts están en: ${binDir}`);
console.log('💡 Asegúrate de usar ese path al llamarlos desde el bot.');
