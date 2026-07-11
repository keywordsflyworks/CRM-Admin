import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // different from crm-frontend (5173) so both can run at once
    open: '/login', // auto-open browser straight to the admin login page
  },
})