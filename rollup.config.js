var babel = require("rollup-plugin-babel");
var resolve = require("rollup-plugin-node-resolve");
var terser = require("rollup-plugin-terser").terser;
var filesize = require("rollup-plugin-filesize");

const isProduction = process.env.NODE_ENV === "production";

const name = "CommonObjectOperations";

const destBase = "dist/index";
const destExtension = `${isProduction ? ".min" : ""}.js`;

module.exports = {
  input: "src/index.js",
  output: [
    {
      file: `${destBase}${destExtension}`,
      format: "cjs"
    },
    {
      file: `${destBase}.esm${destExtension}`,
      format: "esm"
    },
    {
      file: `${destBase}.umd${destExtension}`,
      format: "umd",
      name: name
    },
    {
      file: `${destBase}.amd${destExtension}`,
      format: "amd",
      name: name
    },
    {
      file: `${destBase}.browser${destExtension}`,
      format: "iife",
      name: name
    }
  ],
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**"
    }),
    isProduction && terser(),
    filesize()
  ].filter(Boolean)
};
