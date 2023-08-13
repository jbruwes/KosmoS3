// Utilities
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  define: { "process.env": {} },
  resolve: {
    extensions: [".js"],
  },
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: resolve(__dirname, "main.js"),
      output: {
        manualChunks: false,
        inlineDynamicImports: true,
        entryFileNames: "[name].js",
      },
    },
  },
});
