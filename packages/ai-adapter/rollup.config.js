import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const packageJson = require(path.resolve(__dirname, "./package.json"));

const name = packageJson.main.replace(/\.(?:c?js)$/, "");
const generatedUiModule = "@embeddedchat/ui-kit/generated-ui.mjs";
const generatedUiContract = {
  name: "generated-ui-contract",
  resolveId(id) {
    return id === generatedUiModule ? require.resolve(id) : null;
  },
};

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: (id) =>
    id !== generatedUiModule && id[0] !== "." && !path.isAbsolute(id),
});

export default [
  bundle({
    plugins: [generatedUiContract, esbuild()],
    output: [
      { file: `${name}.cjs`, format: "cjs", sourcemap: true },
      { file: `${name}.mjs`, format: "es", sourcemap: true },
    ],
  }),
  bundle({
    plugins: [generatedUiContract, dts()],
    output: { file: `${name}.d.ts`, format: "es" },
  }),
];
