"use strict";

import clear from "rollup-plugin-clear";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: {
    file: "bundle.js",
    format: "umd",
    sourcemap: false
  },

  plugins: [
    clear({ targets: ["bundle.js"] }),
    resolve(),
    commonjs(),
    typescript({tsconfig: "./tsconfig.json"}),
  ]
}
