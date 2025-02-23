export const preset = "ts-jest";
export const testEnvironment = "node";

// jest.config.ts
import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json"; // or tsconfig.paths.json if you have it

const config: Config.InitialOptions = {
  preset: "ts-jest",
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};
export default config;
