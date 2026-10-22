import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Anfragen an /api gehen an unser Express-Backend (server/index.js)
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
