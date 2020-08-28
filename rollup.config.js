import typescript from "@rollup/plugin-typescript"
import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"

export default [{
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "cjs",
    sourcemap: true,
    exports: "default",
  },
  plugins: [
    typescript({
      outDir: "dist",
      sourceMap: true,
      declaration: true,
    }),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".ts"],
      presets: [
        ["@babel/preset-env", {
          useBuiltIns: false,
        }],
      ],
    }),
  ],
},
{
  input: "src/index.ts",
  output: {
    file: "dist/diff-arr.js",
    name: "diffArr",
    format: "umd",
    exports: "default",
  },
  plugins: [
    typescript({
      sourceMap: false,
      declaration: false,
      declarationMap: false,
    }),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".ts"],
      presets: [
        ["@babel/preset-env", {
          useBuiltIns: false,
        }],
      ],
    }),
  ],
},
{
  input: "src/index.ts",
  output: {
    file: "dist/diff-arr.min.js",
    name: "diffArr",
    format: "umd",
    exports: "default",
  },
  plugins: [
    typescript({
      sourceMap: false,
      declaration: false,
      declarationMap: false,
    }),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".ts"],
      presets: [
        ["@babel/preset-env", {
          useBuiltIns: false,
        }],
      ],
    }),
    terser(),
  ],
}]
