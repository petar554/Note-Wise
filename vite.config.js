import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // makes the server accessible on the local network
    port: 5173 
  },
  plugins: [react()],
});
