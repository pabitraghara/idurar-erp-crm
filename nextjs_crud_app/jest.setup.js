import "whatwg-fetch";
import { loadEnvConfig } from "@next/env";

// Load environment variables
loadEnvConfig(process.cwd());

// Mock MongoDB for tests
jest.mock("./lib/mongodb", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));

// Mock next/navigation for tests
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => "/"),
}));

// Global test setup
global.console = {
  ...console,
  // Silence console logs in tests
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
