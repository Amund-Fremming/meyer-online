import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs' // Import the commonjs plugin
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [
    react(),
    commonjs(), // Use the commonjs plugin
    tailwindcss(),
  ]
})