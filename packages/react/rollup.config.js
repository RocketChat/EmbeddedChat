import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import external from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';
import bundleSize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import analyze from 'rollup-plugin-analyzer';

const packageJson = require('./package.json');
const PRODUCTION = process.env.NODE_ENV === 'production';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        plugins: [PRODUCTION && terser()],
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        plugins: [PRODUCTION && terser()],
      },
    ],
    external: [
      'react',
      'react-dom',
      'lodash',
      '@emotion/react',
      '@embeddedchat/ui-elements',
      '@embeddedchat/api',
      '@embeddedchat/ui-kit',
      '@embeddedchat/markups',
    ],
    plugins: [
      replace(
        PRODUCTION
          ? {
              'process.env.NODE_ENV': JSON.stringify('production'),
              "process.env['NODE_ENV']": JSON.stringify('production'),
              'process.env["NODE_ENV"]': JSON.stringify('production'),
            }
          : {}
      ),
      resolve({
        browser: true,
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
      }),
      commonjs({ include: ['node_modules/**', '../../node_modules/**'] }),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/env', '@babel/preset-react'],
        babelHelpers: 'bundled',
      }),
      postcss(),
      json(),
      external(),
      analyze({
        limit: 20,
        summaryOnly: true,
      }),
      bundleSize(),
    ],
  },
];
