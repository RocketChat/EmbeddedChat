import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import external from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';
import bundleSize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';

const packageJson = require('./package.json');
const env = process.env.NODE_ENV;

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        plugins: [env === 'production' && terser()],
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        plugins: [env === 'production' && terser()],
      },
    ],
    plugins: [
      resolve({ browser: true, extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
      commonjs({ include: ['node_modules/**', '../../node_modules/**'] }),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/env', '@babel/preset-react'],
        babelHelpers: 'bundled',
      }),
      postcss(),
      json(),
      external(),
      bundleSize(),
    ],
  },
];
