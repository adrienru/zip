import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import { exec } from 'child_process';
import filesize from 'filesize';

const token = '8030102197:AAFguKfxcny20rcD3p5B0d3iEYWkqvYHtzI'; // Tu token
const bot = new TelegramBot(token, { polling: true });

// Ruta al ejecutable del CLI de terabox-node
const CLI_PATH = '../terabox-node-2.3.1/cli.js'; // ejecutable real
const CONFIG_PATH = '../terabox-node-2.3.1/config.yaml';

// Función para ejecutar un comando de terabox-node
function runTeraBoxCommand(args = []) {
  return new Promise((resolve, reject) => {
    const cmd = `node ${CLI_PATH} ${args.join(' ')}`;
    exec(cmd, { env: process.env }, (error, stdout, stderr) => {
      if (error) return reject(stderr || stdout || error);
      resolve(stdout);
    });
  });
}

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '👋 ¡Hola! Este bot está conectado a tu cuenta de TeraBox usando terabox-node.\nUsa /listar para ver tus archivos.');
});

bot.onText(/\/listar/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '🔄 Listando archivos, espera...');

  try {
    const output = await runTeraBoxCommand(['list']);
    const parsed = parseFileList(output);
    if (parsed.length === 0) {
      await bot.sendMessage(chatId, '📁 No hay archivos.');
    } else {
      const mensaje = parsed.map(item => `📄 ${item.name} (${filesize(item.size)})`).join('\n');
      await bot.sendMessage(chatId, `📁 Archivos encontrados:\n\n${mensaje}`);
    }
  } catch (err) {
    await bot.sendMessage(chatId, `❌ Error: ${err}`);
  }
});

function parseFileList(output) {
  const files = [];
  const lines = output.split('\n');
  for (let line of lines) {
    const match = line.match(/(.+?)\s+\((\d+)\)$/);
    if (match) {
      files.push({
        name: match[1].trim(),
        size: parseInt(match[2])
      });
    }
  }
  return files;
}
