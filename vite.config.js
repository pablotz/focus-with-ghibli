import { defineConfig } from 'vite'
import { qrcode } from 'vite-plugin-qrcode';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), qrcode()],
})
