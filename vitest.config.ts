import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        exclude: ['node_modules/**', 'e2e/**'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'src/test/', '*.config.*', 'src/stories/'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    define: {
        'import.meta.env.VITE_SUPABASE_URL': '"https://test.supabase.co"',
        'import.meta.env.VITE_SUPABASE_ANON_KEY': '"test-anon-key"',
        'import.meta.env.VITE_APP_URL': '"http://localhost:5182"',
    },
})
