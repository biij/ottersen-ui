import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Library mode: one ES module, with React left to the consuming app so there's
// only ever one copy of it at runtime. Type declarations come from
// tsconfig.build.json and the stylesheets from scripts/copy-styles.mjs.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    emptyOutDir: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
})
