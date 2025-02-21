import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
      components: "/src/components",
      assets: "/src/assets",
      pages: "/src/pages",
      utils: "/src/utils",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080/",
      },
    },
  },
});
