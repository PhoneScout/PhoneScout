import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: __dirname,
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: resolve(__dirname, "src/setupTests.js"),
  },
});