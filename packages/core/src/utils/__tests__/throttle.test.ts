import { throttle, throttleAsync } from '../throttle';

// Mock timers for testing
jest.useFakeTimers();

describe('Throttle Utilities', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  describe('throttle', () => {
    test('should execute function immediately on first call', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should not execute function if called again within the limit', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled();
      throttled();
      throttled();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should execute function again after the limit has passed', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled();
      expect(mockFn).toHaveBeenCalledTimes(1);

      // Advance time by 101ms
      jest.advanceTimersByTime(101);

      throttled();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    test('should pass arguments to the original function', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled('arg1', 'arg2');

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    test('should maintain the context of the original function', () => {
      const obj = {
        value: 'test',
        method: function (this: any) {
          return this.value;
        },
      };

      const spy = jest.spyOn(obj, 'method');
      const throttled = throttle(obj.method, 100).bind(obj);

      throttled();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttleAsync', () => {
    test('should execute async function immediately on first call', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const throttled = throttleAsync(mockFn, 100);

      const promise = throttled();

      expect(mockFn).toHaveBeenCalledTimes(1);
      await expect(promise).resolves.toBe('result');
    });

    test('should not execute async function if called again within the limit', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const throttled = throttleAsync(mockFn, 100);

      await throttled();
      throttled();
      throttled();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should execute async function again after the limit has passed', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const throttled = throttleAsync(mockFn, 100);

      await throttled();
      expect(mockFn).toHaveBeenCalledTimes(1);

      // Advance time by 101ms
      jest.advanceTimersByTime(101);

      await throttled();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    test('should pass arguments to the original async function', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const throttled = throttleAsync(mockFn, 100);

      await throttled('arg1', 'arg2');

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    test('should propagate rejections from the original async function', async () => {
      const error = new Error('Test error');
      const mockFn = jest.fn().mockRejectedValue(error);
      const throttled = throttleAsync(mockFn, 100);

      await expect(throttled()).rejects.toThrow('Test error');
    });
  });
});
