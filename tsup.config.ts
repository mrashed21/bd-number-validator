import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    react: "src/react/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  injectStyle: false,
  splitting: false,

  loader: {
    ".svg": "file",
    ".css": "css",
  },

  onSuccess: "cpy src/react/bd-phone.css dist/",
});
