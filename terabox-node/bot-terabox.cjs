// bot-terabox.cjs
const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');

const token = '8030102197:AAFguKfxcny20rcD3p5B0d3iEYWkqvYHtzI'; // <- coloca tu token aquí
const bot = new TelegramBot(token, { polling: true });

const RUTA_SCRIPTS = path.join(__dirname, 'bin');
const RUTA_SUBIDA_DEFECTO = path.join(os.tmpdir(), 'BotTelegram');

// Crear carpeta si no existe
if (!fs.existsSync(RUTA_SUBIDA_DEFECTO)) {
  fs.mkdirSync(RUTA_SUBIDA_DEFECTO, { recursive: true });
}

const comandos = {
  '/start': '¡Hola! Soy el bot de TeraBox. Usa /ayuda para ver comandos.',
  '/ayuda': `
📂 *Comandos disponibles:*
/cuentas — Ver cuentas configuradas
/subir -a nombre -r /ruta — Subir archivo recibido
/descargar -a nombre -r /ruta — Descargar archivo
/metainfo -a nombre -r /ruta — Info archivo
/hash -l /local — Crear TBHash
/compartido -a nombre -s link — Descargar archivo compartido
/config — Mostrar configuración actual
`.trim(),
  '/config': '⚙️ Este bot usa los scripts de la carpeta /bin y la configuración .config.yaml.',
};

function ejecutarScript(cmd, chatId) {
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      bot.sendMessage(chatId, `❌ Error:\n${stderr || err.message}`);
    } else {
      bot.sendMessage(chatId, `✅ Resultado:\n${stdout || 'Comando ejecutado.'}`);
    }
  });
}

bot.onText(/^\/(start|ayuda|config)$/, (msg, match) => {
  const respuesta = comandos[`/${match[1]}`];
  bot.sendMessage(msg.chat.id, respuesta, { parse_mode: 'Markdown' });
});

bot.onText(/^\/cuentas$/, (msg) => {
  const cmd = `node ${path.join(RUTA_SCRIPTS, 'tb-check.cjs')}`;
  ejecutarScript(cmd, msg.chat.id);
});

bot.onText(/^\/metainfo (.+)$/, (msg, match) => {
  const args = match[1];
  const cmd = `node ${path.join(RUTA_SCRIPTS, 'tb-filemeta.cjs')} ${args}`;
  ejecutarScript(cmd, msg.chat.id);
});

bot.onText(/^\/hash (.+)$/, (msg, match) => {
  const args = match[1];
  const cmd = `node ${path.join(RUTA_SCRIPTS, 'tb-mkhash.cjs')} ${args}`;
  ejecutarScript(cmd, msg.chat.id);
});

bot.onText(/^\/descargar (.+)$/, (msg, match) => {
  const args = match[1];
  const cmd = `node ${path.join(RUTA_SCRIPTS, 'tb-getdl.cjs')} ${args}`;
  ejecutarScript(cmd, msg.chat.id);
});

bot.onText(/^\/compartido (.+)$/, (msg, match) => {
  const args = match[1];
  const cmd = `node ${path.join(RUTA_SCRIPTS, 'tb-getdl-share.cjs')} ${args}`;
  ejecutarScript(cmd, msg.chat.id);
});

bot.onText(/^\/subir (.+)$/, (msg, match) => {
  const args = match[1];
  const cmd = `node ${path.join(RUTA_SCRIPTS, 'tb-upload.cjs')} ${args}`;
  ejecutarScript(cmd, msg.chat.id);
});

// Manejo automático de archivos enviados
bot.on('document', async (msg) => {
  const fileId = msg.document.file_id;
  const chatId = msg.chat.id;
  const fileName = msg.document.file_name;
  const rutaLocal = path.join(RUTA_SUBIDA_DEFECTO, fileName);

  try {
    const file = await bot.getFile(fileId);
    const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

    const fileStream = fs.createWriteStream(rutaLocal);
    https.get(url, (res) => {
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        bot.sendMessage(chatId, `📤 Subiendo *${fileName}* a TeraBox...`, { parse_mode: 'Markdown' });

        const cmd = `node ${path.join(RUTA_SCRIPTS, 'tb-upload.cjs')} -l "${rutaLocal}" -r /BotTelegram`;
        exec(cmd, (err, stdout, stderr) => {
          if (err) {
            bot.sendMessage(chatId, `❌ Error al subir: ${stderr || err.message}`);
          } else {
            bot.sendMessage(chatId, `✅ Subido a /BotTelegram\n\n${stdout}`);
            fs.unlinkSync(rutaLocal);
          }
        });
      });
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ No pude descargar el archivo: ${error.message}`);
  }
});
