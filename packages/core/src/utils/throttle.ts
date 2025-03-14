/**
 * Throttle function to limit the rate at which a function can fire
 *
 * @param func - The function to throttle
 * @param limit - The time limit in milliseconds
 * @returns A throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let lastCall = 0;
  let lastResult: ReturnType<T>;

  return function (
    this: any,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      lastResult = func.apply(this, args);
      return lastResult;
    }

    return undefined;
  };
}

/**
 * Throttle function that returns a promise
 *
 * @param func - The async function to throttle
 * @param limit - The time limit in milliseconds
 * @returns A throttled async function
 */
export function throttleAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  let lastCall = 0;
  let inProgress = false;
  let lastPromise: Promise<Awaited<ReturnType<T>>>;

  return async function (
    this: any,
    ...args: Parameters<T>
  ): Promise<Awaited<ReturnType<T>>> {
    const now = Date.now();

    if (inProgress) {
      return lastPromise;
    }

    if (now - lastCall >= limit) {
      lastCall = now;
      inProgress = true;

      try {
        const result = await func.apply(this, args);
        lastPromise = Promise.resolve(result);
        return result;
      } finally {
        inProgress = false;
      }
    }

    return lastPromise;
  };
}
