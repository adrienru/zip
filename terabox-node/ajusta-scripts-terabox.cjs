const fs = require("fs");
const path = require("path");

const binDir = path.join(__dirname, "bin");
const scripts = [
  { name: "tb-check", target: "app-check.js" },
  { name: "tb-upload", target: "app-uploader.js" },
  { name: "tb-getdl", target: "app-getdl.js" },
  { name: "tb-getdl-share", target: "app-getdl-share.js" },
  { name: "tb-filemeta", target: "app-filemeta.js" },
  { name: "tb-mkhash", target: "app-mktbhash.js" },
];

scripts.forEach(({ name, target }) => {
  const filePath = path.join(binDir, `${name}.cjs`);
  if (fs.existsSync(filePath)) {
    const content = `#!/usr/bin/env node\nrequire("../app/${target}");\n`;
    fs.writeFileSync(filePath, content, "utf-8");
    fs.chmodSync(filePath, 0o755);
    console.log(`✅ Ajustado: ${name}.cjs`);
  } else {
    console.log(`⚠️ No encontrado: ${name}.cjs`);
  }
});

// Ajuste del archivo principal del bot
const botPath = path.join(__dirname, "bot-terabox.js");
if (fs.existsSync(botPath)) {
  const newPath = path.join(__dirname, "bot-terabox.cjs");
  fs.renameSync(botPath, newPath);
  console.log(`🛠️  Archivo bot-terabox.js actualizado con extensión .cjs`);
} else {
  console.log("ℹ️  bot-terabox.js no encontrado. Aún no lo generamos.");
}
