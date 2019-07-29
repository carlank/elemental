"use strict";

import clear from "rollup-plugin-clear";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: {
    file: "public/bundle.js",
    format: "umd",
    sourcemap: false
  },

  plugins: [
    clear({ targets: ["public/bundle.js"] }),
    resolve(),
    commonjs(),
    typescript({tsconfig: "./tsconfig.json"}),
  ]
}
