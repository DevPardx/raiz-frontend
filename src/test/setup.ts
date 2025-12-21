import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const activeTimers = new Set<any>();

afterEach(() => {
  activeTimers.forEach((id) => {
    clearTimeout(id);
    clearInterval(id);
  });
  activeTimers.clear();
  cleanup();
  vi.clearAllMocks();
});

// Patch timers to track them
const originalSetTimeout = globalThis.setTimeout;
const originalSetInterval = globalThis.setInterval;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).setTimeout = (fn: TimerHandler, delay?: number, ...args: unknown[]) => {
  const id = originalSetTimeout(fn, delay, ...args);
  activeTimers.add(id);
  return id;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).setInterval = (fn: TimerHandler, delay?: number, ...args: unknown[]) => {
  const id = originalSetInterval(fn, delay, ...args);
  activeTimers.add(id);
  return id;
};
