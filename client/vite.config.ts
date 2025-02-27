import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from "vite-plugin-environment";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDocker = env.DOCKER_ENV === "true";
  const host = isDocker ? "0.0.0.0" : "localhost";
  const hostOrContainer = isDocker ? "tdv-fastify" : host;
  return {
    host,
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
      port: 5173,
      strictPort: true,
      host: true,
      origin: `http://${host}:5173`,
      proxy: {
        "/api": {
          target: `http://${hostOrContainer}:8080`,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    base: "/",
  };
});
