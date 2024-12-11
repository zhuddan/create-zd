/// <reference types="vitest" />

import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, './')
  return {
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    plugins: [
      Vue(),
    ],

    server: {
      port: Number(env.VITE_APP_PORT),
      host: true,
    },
    // https://github.com/vitest-dev/vitest
    test: {
      environment: 'jsdom',
    },
  }
})
