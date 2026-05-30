import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:                   'index.html',
        about:                  'about.html',
        'react-component':      'work/react-component-system.html',
        'react-app':            'work/react-app.html',
        'vue-component':        'work/vue-component-system.html',
        'portfolio':            'work/portfolio.html',
      },
    },
  },
});
