import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://45.76.80.83:3000',
        changeOrigin: true,
        secure: false, // allows self-signed certificates
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    host: '0.0.0.0', // makes the server accessible on the local network
  },
});
