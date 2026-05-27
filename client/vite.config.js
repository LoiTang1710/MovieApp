import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

function resolveProxyTarget(env) {
  const port = String(env.VITE_SERVER_PORT ?? '3000').trim()
  let url = String(env.VITE_SERVER_URL ?? '').trim()

  if (url) {
    url = url.replace(/\$\{VITE_SERVER_PORT\}/g, port)
  }

  if (!/^https?:\/\//i.test(url)) {
    return `http://localhost:${port}`
  }

  return url.replace(/\/$/, '')
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = resolveProxyTarget(env)

  return {
    plugins: [
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
