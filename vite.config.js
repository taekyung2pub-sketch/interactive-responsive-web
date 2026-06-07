import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:                   'index.html',
        about:                  'about.html',
        'react-component':      'work/react-component-system.html',
        'react-app':            'work/react-app.html',
        'portfolio':            'work/portfolio.html',
        'coming-soon':        'work/coming-soon.html',
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
});
