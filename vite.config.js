import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',  // Important for relative paths
  build: {
    outDir: 'dist', // Vercel looks for the 'dist' folder
  }
});
