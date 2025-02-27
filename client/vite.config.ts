import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from "vite-plugin-environment";

export default defineConfig({
  plugins: [react(), EnvironmentPlugin("all")],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./setupTests.js"],
  },
  resolve: {
    alias: {
      src: "/src",
      components: "/src/components",
      assets: "/src/assets",
      pages: "/src/pages",
      utils: "/src/utils",
      mock: "/src/mock",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080/",
      },
    },
  },
  base: "/",
});
