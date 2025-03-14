import { Event } from '../../interfaces/events';
import { EventBusImpl, createEventBus } from '../event-bus';

describe('EventBus', () => {
  let eventBus: EventBusImpl;

  beforeEach(() => {
    eventBus = new EventBusImpl();
  });

  test('should subscribe to events', () => {
    const handler = jest.fn();
    eventBus.subscribe('test', handler);

    expect(eventBus.subscriberCount('test')).toBe(1);
  });

  test('should emit events to subscribers', () => {
    const handler = jest.fn();
    const event: Event = { type: 'test', timestamp: Date.now() };

    eventBus.subscribe('test', handler);
    eventBus.emit(event);

    expect(handler).toHaveBeenCalledWith(event);
  });

  test('should not call handlers for different event types', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const event: Event = { type: 'test1', timestamp: Date.now() };

    eventBus.subscribe('test1', handler1);
    eventBus.subscribe('test2', handler2);

    eventBus.emit(event);

    expect(handler1).toHaveBeenCalledWith(event);
    expect(handler2).not.toHaveBeenCalled();
  });

  test('should allow unsubscribing from events', () => {
    const handler = jest.fn();
    const event: Event = { type: 'test', timestamp: Date.now() };

    const unsubscribe = eventBus.subscribe('test', handler);
    unsubscribe();

    eventBus.emit(event);

    expect(handler).not.toHaveBeenCalled();
    expect(eventBus.subscriberCount('test')).toBe(0);
  });

  test('should clear all handlers for a specific event type', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const event: Event = { type: 'test', timestamp: Date.now() };

    eventBus.subscribe('test', handler1);
    eventBus.subscribe('test', handler2);

    eventBus.clear('test');
    eventBus.emit(event);

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
    expect(eventBus.subscriberCount('test')).toBe(0);
  });

  test('should clear all handlers for all event types', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const event1: Event = { type: 'test1', timestamp: Date.now() };
    const event2: Event = { type: 'test2', timestamp: Date.now() };

    eventBus.subscribe('test1', handler1);
    eventBus.subscribe('test2', handler2);

    eventBus.clear();

    eventBus.emit(event1);
    eventBus.emit(event2);

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
    expect(eventBus.subscriberCount('test1')).toBe(0);
    expect(eventBus.subscriberCount('test2')).toBe(0);
  });

  test('should handle errors in event handlers', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const handler = jest.fn().mockImplementation(() => {
      throw new Error('Test error');
    });
    const event: Event = { type: 'test', timestamp: Date.now() };

    eventBus.subscribe('test', handler);
    eventBus.emit(event);

    expect(handler).toHaveBeenCalledWith(event);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  test('should emit to wildcard handlers', () => {
    const wildcardHandler = jest.fn();
    const event: Event = { type: 'test', timestamp: Date.now() };

    eventBus.subscribe('*', wildcardHandler);
    eventBus.emit(event);

    expect(wildcardHandler).toHaveBeenCalledWith(event);
  });

  test('createEventBus should return a new EventBus instance', () => {
    const eventBus = createEventBus();
    expect(eventBus).toBeDefined();
    expect(eventBus.subscribe).toBeDefined();
    expect(eventBus.emit).toBeDefined();
    expect(eventBus.clear).toBeDefined();
    expect(eventBus.subscriberCount).toBeDefined();
  });

  test('should add timestamp if not provided', () => {
    const handler = jest.fn();
    const event = { type: 'test' } as Event;

    eventBus.subscribe('test', handler);
    eventBus.emit(event);

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].timestamp).toBeDefined();
  });

  test('debug mode should log events', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const debugEventBus = new EventBusImpl({ debug: true });
    const handler = jest.fn();
    const event: Event = { type: 'test', timestamp: Date.now() };

    debugEventBus.subscribe('test', handler);
    debugEventBus.emit(event);

    expect(consoleLogSpy).toHaveBeenCalled();

    consoleLogSpy.mockRestore();
  });
});
