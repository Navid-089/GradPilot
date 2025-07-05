import "@testing-library/jest-dom";

// ---- ✅ Global fetch mock ----
global.fetch = jest.fn();

// ---- ✅ Mock localStorage ----
const localStorageStore = {};

const localStorageMock = {
  getItem: jest.fn((key) => localStorageStore[key] || null),
  setItem: jest.fn((key, value) => {
    localStorageStore[key] = value;
  }),
  removeItem: jest.fn((key) => {
    delete localStorageStore[key];
  }),
  clear: jest.fn(() => {
    Object.keys(localStorageStore).forEach(
      (key) => delete localStorageStore[key]
    );
  }),
};

// Assign mock to window and global
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});
global.localStorage = localStorageMock;

// ---- ✅ Mock console methods ----
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// ---- ✅ Reset all mocks after each test ----
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});
