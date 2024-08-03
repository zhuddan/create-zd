import { defineConfig } from 'tsup'

export default ({ watch }) => (
  defineConfig({
    entry: {
      outfile: 'src/test.ts',
    },
    format: 'cjs',
    platform: 'node',
    target: 'node14',
    minify: watch ? false : 'terser',
    clean: true,
  })
)
