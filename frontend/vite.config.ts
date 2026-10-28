import { execSync } from 'node:child_process'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

function gitCommit(): string {
  try {
    return execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return 'dev'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    'import.meta.env.VITE_GIT_COMMIT': JSON.stringify(gitCommit()),
  },
})
