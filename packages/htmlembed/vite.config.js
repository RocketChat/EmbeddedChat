import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import path from 'path';

export default defineConfig({
	plugins: [react(), cssInjectedByJsPlugin()],
	build: {
		minify: true,
		cssCodeSplit: false,
		lib: {
			entry: path.resolve(__dirname, 'src/index.js'),
			name: 'EmbeddedChat',
			formats: ['umd'],
			fileName: () => 'embeddedchat.js',
		}
	},
	define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' }
})