#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadYaml } from './modules/app-helper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.resolve(__dirname, './config/.config.yaml');

console.log('🧪 Verificando archivo de configuración...\n');

if (!fs.existsSync(configPath)) {
  console.error('❌ ERROR: No se encontró el archivo .config.yaml en /config');
  process.exit(1);
}

try {
  const config = loadYaml(configPath);

  if (!config.accounts || Object.keys(config.accounts).length === 0) {
    console.error('❌ ERROR: No hay cuentas definidas en config.accounts');
  } else {
    console.log('✅ Cuentas encontradas en config.accounts:\n');
    for (const key of Object.keys(config.accounts)) {
      console.log(`🔹 ${key}: ${config.accounts[key]}`);
    }
  }

  if (!config.aria2 || !config.aria2.url) {
    console.warn('\n⚠️ ADVERTENCIA: No se definió correctamente la configuración de Aria2');
  } else {
    console.log('\n✅ Configuración de Aria2 detectada correctamente');
    console.log(`🔸 URL: ${config.aria2.url}`);
    console.log(`🔸 Secret: ${config.aria2.secret}`);
  }
} catch (error) {
  console.error('❌ ERROR al leer el archivo .config.yaml:', error.message);
}
