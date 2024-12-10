import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    strictPort: true,
    open: true,
  },
  resolve: {
    alias: {
      // Add any necessary aliases if you have complex import paths
    }
  },
  build: {
    rollupOptions: {
      // Add any specific build configurations
    }
  }
});
