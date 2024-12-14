import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['app.ts'],
  outDir: './',
  target: 'es2020',
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  minify: false,
  shims: true,
  dts: false,
  external: ["markdown-it"]
})
