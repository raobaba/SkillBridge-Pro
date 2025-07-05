// src/models/index.js
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const files = fs.readdirSync(__dirname);

let schema = {};

for (const file of files) {
  if (file.endsWith('.js') && file !== 'index.js') {
    const module = await import(`./${file}`);
    schema = { ...schema, ...module };
  }
}

export default schema;
