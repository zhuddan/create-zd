import { defineConfig } from 'tsup'

export default ({ watch }) => (
  defineConfig({
    entry: {
      script: 'src/index.ts',
    },
    format: 'cjs',
    platform: 'node',
    target: 'node16',
    minify: watch ? false : 'terser',
    clean: true,
  })
)
