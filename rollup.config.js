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
      rootDir: "src",
      exclude: "test/**",
      declaration: true,
      declarationMap: true,
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
    file: "umd/array-edit-steps.js",
    name: "getEditSteps",
    format: "umd",
    exports: "default",
    sourcemap: true,
  },
  plugins: [
    typescript(),
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
    file: "umd/array-edit-steps.min.js",
    name: "getEditSteps",
    format: "umd",
    exports: "default",
    sourcemap: true,
  },
  plugins: [
    typescript(),
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
