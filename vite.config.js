import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const pkg = JSON.parse(
  readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), 'package.json'), 'utf8')
);

export default defineConfig({
  plugins: [react()],
  define: {
    __SOKKI_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    outDir: 'dist',
  },
});
