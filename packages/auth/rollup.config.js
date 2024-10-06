import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import path from 'path';
import packageJson from './package.json' assert { type: 'json' };

const name = packageJson.main.replace(/\.js$/, '');

const bundle = config => ({
  ...config,
  input: 'src/index.ts',
  external: id => {
    return id[0] !== '.' && !path.isAbsolute(id);
  },
})

export default [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: `${name}.js`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `${name}.mjs`,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: 'es',
    },
  }),
]
