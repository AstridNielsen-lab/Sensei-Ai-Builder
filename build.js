#!/usr/bin/env node

import { build } from 'vite';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

try {
  console.log('Starting Vite build...');
  await build({
    configFile: './vite.config.js',
    mode: 'production'
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

