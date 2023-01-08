// Plugins
import { viteStaticCopy } from 'vite-plugin-static-copy'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  root: "./",
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
  assetsInclude: [
    //"node_modules/muuri/dist/*"
  ],
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "./node_modules/muuri/dist/muuri.min.js",
          dest: "./muuri"
        }
      ]
    })
  ],
  base: "./",
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: true
  },
})
