import "@testing-library/jest-dom";
import { TextEncoder } from "util"; // why? worth writing about? jest.setup.ts
global.TextEncoder = TextEncoder;
