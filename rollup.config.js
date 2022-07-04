import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import external from "rollup-plugin-peer-deps-external";
import json from "@rollup/plugin-json";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.js",
    output: [
      { file: packageJson.main, format: "cjs", sourcemap: true },
      { file: packageJson.module, format: "esm", sourcemap: true },
    ],
    plugins: [
      resolve({ browser: true }),
      commonjs({ include: ['node_modules/**'] }),
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/env", "@babel/preset-react"],
        babelHelpers: 'bundled'
      }),
      postcss(),
      json(),
      external(),
    ],
  },
];
