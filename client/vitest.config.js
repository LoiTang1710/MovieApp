// client/vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Provide stub values for Vite-specific environment variables
    // so modules that reference import.meta.env can be tested in Node
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:5000/api'),
      'import.meta.env.VITE_SERVER_URL': JSON.stringify('http://localhost:3000'),
      'import.meta.env.VITE_SERVER_PORT': JSON.stringify('3000'),
      'import.meta.env.VITE_ACCESS_TOKEN': JSON.stringify(''),
    },
  },
})