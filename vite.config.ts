import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        tailwindcss(),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            popup: path.resolve(__dirname, 'popup/popup.html'),
            background: path.resolve(__dirname, 'background/background.js'),
            content: path.resolve(__dirname, 'content/content.js'),
          },
          output: {
            entryFileNames: (chunkInfo) => {
              if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
                return '[name]/[name].js';
              }
              if (chunkInfo.name === 'main') {
                return 'assets/[name].js';
              }
              return 'assets/[name]-[hash].js';
            },
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
          },
        },
      }
    };
});
