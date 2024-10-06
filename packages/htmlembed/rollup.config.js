import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
	input: 'src/index.js',
	output: {
		file: 'dist/embeddedchat.js',
		format: 'umd',
		name: 'EmbeddedChat',
	},
	plugins: [
		resolve(),
		commonjs(),
		babel({
			babelHelpers: 'bundled',
			presets: ['@babel/preset-react'],
		}),
		terser(),
	],
};
