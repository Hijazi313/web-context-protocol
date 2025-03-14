/**
 * Debounce function to delay execution until after a period of inactivity
 *
 * @param func - The function to debounce
 * @param wait - The wait time in milliseconds
 * @param immediate - Whether to execute the function immediately
 * @returns A debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };
}

/**
 * Debounce function that returns a promise
 *
 * @param func - The async function to debounce
 * @param wait - The wait time in milliseconds
 * @param immediate - Whether to execute the function immediately
 * @returns A debounced async function
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | undefined> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let pendingPromise: Promise<Awaited<ReturnType<T>>> | null = null;

  return function (
    this: any,
    ...args: Parameters<T>
  ): Promise<Awaited<ReturnType<T>> | undefined> {
    return new Promise((resolve, reject) => {
      const later = async () => {
        timeout = null;

        if (!immediate) {
          try {
            const result = await func.apply(this, args);
            pendingPromise = Promise.resolve(result);
            resolve(result);
          } catch (error) {
            pendingPromise = null;
            reject(error);
          }
        }
      };

      const callNow = immediate && !timeout;

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(later, wait);

      if (callNow) {
        try {
          const result = func.apply(this, args);
          pendingPromise = Promise.resolve(result);
          resolve(result);
        } catch (error) {
          pendingPromise = null;
          reject(error);
        }
      } else if (pendingPromise) {
        resolve(pendingPromise);
      }
    });
  };
}
