import { debounce, debounceAsync } from '../debounce';

// Mock timers for testing
jest.useFakeTimers();

describe('Debounce Utilities', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  describe('debounce', () => {
    test('should not execute function immediately', () => {
      const mockFn = jest.fn();
      const debounced = debounce(mockFn, 100);

      debounced();

      expect(mockFn).not.toHaveBeenCalled();
    });

    test('should execute function after the wait time', () => {
      const mockFn = jest.fn();
      const debounced = debounce(mockFn, 100);

      debounced();

      // Advance time by 100ms
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should reset the timer if called again before wait time', () => {
      const mockFn = jest.fn();
      const debounced = debounce(mockFn, 100);

      debounced();

      // Advance time by 50ms (half the wait time)
      jest.advanceTimersByTime(50);

      // Call again, which should reset the timer
      debounced();

      // Advance time by another 50ms (not enough for the second call)
      jest.advanceTimersByTime(50);

      // Function should not have been called yet
      expect(mockFn).not.toHaveBeenCalled();

      // Advance time by another 50ms (enough for the second call)
      jest.advanceTimersByTime(50);

      // Function should now have been called once
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should pass the latest arguments to the function', () => {
      const mockFn = jest.fn();
      const debounced = debounce(mockFn, 100);

      debounced('first');
      debounced('second');
      debounced('third');

      // Advance time by 100ms
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('third');
    });

    test('should execute immediately if immediate option is true', () => {
      const mockFn = jest.fn();
      const debounced = debounce(mockFn, 100, true);

      debounced();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should not execute again if called during the wait time with immediate option', () => {
      const mockFn = jest.fn();
      const debounced = debounce(mockFn, 100, true);

      debounced();
      debounced();
      debounced();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should maintain the context of the original function', () => {
      const obj = {
        value: 'test',
        method: function (this: any) {
          return this.value;
        },
      };

      const spy = jest.spyOn(obj, 'method');
      const debounced = debounce(obj.method, 100).bind(obj);

      debounced();

      // Advance time by 100ms
      jest.advanceTimersByTime(100);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('debounceAsync', () => {
    test('should not execute async function immediately', () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const debounced = debounceAsync(mockFn, 100);

      debounced();

      expect(mockFn).not.toHaveBeenCalled();
    });

    test('should execute async function after the wait time', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const debounced = debounceAsync(mockFn, 100);

      const promise = debounced();

      // Advance time by 100ms
      jest.advanceTimersByTime(100);

      await promise;
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should pass the latest arguments to the async function', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const debounced = debounceAsync(mockFn, 100);

      debounced('first');
      debounced('second');
      const promise = debounced('third');

      // Advance time by 100ms
      jest.advanceTimersByTime(100);

      await promise;
      expect(mockFn).toHaveBeenCalledWith('third');
    });

    test('should resolve with the result of the async function', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const debounced = debounceAsync(mockFn, 100);

      const promise = debounced();

      // Advance time by 100ms
      jest.advanceTimersByTime(100);

      await expect(promise).resolves.toBe('result');
    });

    test('should reject with the error from the async function', async () => {
      const error = new Error('Test error');
      const mockFn = jest.fn().mockRejectedValue(error);
      const debounced = debounceAsync(mockFn, 100);

      const promise = debounced();

      // Advance time by 100ms
      jest.advanceTimersByTime(100);

      await expect(promise).rejects.toThrow('Test error');
    });
  });
});
