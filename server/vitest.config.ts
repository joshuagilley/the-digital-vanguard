/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    globals: true,
    environment: "node",
    setupFiles: [],
    testTimeout: 10000,
  },
});
