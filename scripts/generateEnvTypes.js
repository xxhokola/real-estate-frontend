// scripts/generateEnvTypes.js
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const viteVars = Object.keys(process.env).filter((key) => key.startsWith('VITE_'));

const typeLines = viteVars.map(
  (key) => `  readonly ${key}: string;`
);

const content = `/// <reference types="vite/client" />

interface ImportMetaEnv {
${typeLines.join('\n')}
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
`;

fs.writeFileSync(path.resolve('src', 'vite-env.d.ts'), content, 'utf-8');
console.log(`✅ Generated vite-env.d.ts with ${viteVars.length} keys.`);