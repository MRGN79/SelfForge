import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/SelfForge/',
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      thresholds: { lines: 95, functions: 95, branches: 95, statements: 95 },
    },
  },
})
