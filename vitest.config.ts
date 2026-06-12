import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // app code imports 'server-only', which throws outside RSC — neutralize in tests.
      // Deliberately NOT resolve.conditions ['react-server']: react/react-dom honor
      // that condition too and it would strip client hooks, breaking jsdom tests.
      'server-only': path.resolve(__dirname, './src/test/server-only-stub.ts'),
    },
  },
})
