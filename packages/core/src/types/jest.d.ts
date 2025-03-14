// Type definitions for Jest
// This file is used to provide type definitions for Jest in the test files

declare global {
  const jest: {
    fn: <T extends (...args: any[]) => any>(
      implementation?: T
    ) => jest.Mock<ReturnType<T>, Parameters<T>>;
    spyOn: <T extends {}, M extends keyof T>(
      object: T,
      method: M
    ) => jest.SpyInstance<
      T[M] extends (...args: any[]) => any ? ReturnType<T[M]> : T[M],
      T[M] extends (...args: any[]) => any ? Parameters<T[M]> : []
    >;
    useFakeTimers: () => void;
    useRealTimers: () => void;
    clearAllTimers: () => void;
    clearAllMocks: () => void;
    advanceTimersByTime: (msToRun: number) => void;
  };

  function describe(name: string, fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function afterEach(fn: () => void): void;
  function beforeAll(fn: () => void): void;
  function afterAll(fn: () => void): void;
  function test(name: string, fn: () => void | Promise<void>, timeout?: number): void;
  function it(name: string, fn: () => void | Promise<void>, timeout?: number): void;
  function expect<T>(value: T): {
    toBe: (expected: T) => void;
    toEqual: (expected: any) => void;
    toBeDefined: () => void;
    toBeUndefined: () => void;
    toBeNull: () => void;
    toBeTruthy: () => void;
    toBeFalsy: () => void;
    toBeGreaterThan: (expected: number) => void;
    toBeLessThan: (expected: number) => void;
    toContain: (expected: any) => void;
    toHaveProperty: (property: string) => void;
    toHaveBeenCalled: () => void;
    toHaveBeenCalledTimes: (expected: number) => void;
    toHaveBeenCalledWith: (...args: any[]) => void;
    not: any;
    resolves: any;
    rejects: any;
    toBeInstanceOf: (expected: any) => void;
    toThrow: (expected?: string | RegExp) => void;
  };
}

namespace jest {
  interface Mock<T = any, Y extends any[] = any[]> {
    (...args: Y): T;
    mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>;
    mockReturnValue: (value: T) => Mock<T, Y>;
    mockResolvedValue: <U>(value: U) => Mock<Promise<U>, Y>;
    mockRejectedValue: <U>(value: U) => Mock<Promise<U>, Y>;
    mockReturnThis: () => Mock<T, Y>;
    mockReset: () => void;
    mockClear: () => void;
    mock: {
      calls: Y[];
      instances: T[];
      invocationCallOrder: number[];
      results: { type: string; value: T }[];
    };
  }

  interface SpyInstance<T = any, Y extends any[] = any[]> extends Mock<T, Y> {
    mockRestore: () => void;
  }
}

export {};
