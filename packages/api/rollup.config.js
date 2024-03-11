import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import packageJson from './package.json' assert { type: 'json' };
import path from 'path';

const name = packageJson.main.replace(/\.js$/, '');

const bundle = config => ({
  ...config,
  input: 'src/index.ts',
  external: id => id[0] !== '.' && !path.isAbsolute(id),
  onwarn: (warning, warn) => {
    // Handling warnings here
    console.warn(warning);
    if (warning.code === 'PLUGIN_WARNING_CODE') {
      throw new Error('Error during Rollup build: Plugin warning occurred.');
    }
    // Calling the default warning handler
    warn(warning);
  },
});

export default [
  bundle({
    plugins: [
      esbuild(),
      {
        name: 'custom-dts-plugin',
        generateBundle() {
          // Adding custom logic for the dts plugin
        },
        // Handling warnings for this specific plugin
        handleWarn(warning) {
          console.warn(`Custom DTS Plugin Warning: ${warning.message}`);
        },
        // Handling errors for this specific plugin
        handleErr(error) {
          console.error('Custom DTS Plugin Error:', error);
          process.exit(1);
        },
      },
    ],
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
    plugins: [
      dts(),
      {
        // We can add any other custom plugin options or handlers here
      },
    ],
    output: {
      file: `${name}.d.ts`,
      format: 'es',
    },
  }),
];
