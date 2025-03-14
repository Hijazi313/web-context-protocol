/**
 * Event Bus Implementation for the Model Context Protocol
 *
 * This file provides the implementation of the EventBus interface defined in the events interfaces.
 * It includes a simple pub/sub system for event handling throughout the MCP architecture.
 */

import { Event, EventHandler, EventBus } from '../interfaces/events';

/**
 * Implementation of the EventBus interface
 */
export class EventBusImpl implements EventBus {
  private handlers: Map<string, Set<EventHandler<any>>> = new Map();
  private debugMode: boolean = false;

  /**
   * Create a new EventBus instance
   * @param options Configuration options
   */
  constructor(options?: { debug?: boolean }) {
    this.debugMode = options?.debug || false;
  }

  /**
   * Subscribe to an event
   * @param eventType The event type to subscribe to
   * @param handler The handler function to call when the event is emitted
   * @returns A function to unsubscribe the handler
   */
  subscribe<T extends Event>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    const handlers = this.handlers.get(eventType)!;
    handlers.add(handler);

    if (this.debugMode) {
      console.log(`[EventBus] Subscribed to ${eventType}. Total subscribers: ${handlers.size}`);
    }

    return () => {
      this.unsubscribe(eventType, handler);
    };
  }

  /**
   * Emit an event
   * @param event The event to emit
   */
  emit<T extends Event>(event: T): void {
    if (!event.timestamp) {
      (event as any).timestamp = Date.now();
    }

    if (this.debugMode) {
      console.log(`[EventBus] Emitting event: ${event.type}`, event);
    }

    // Emit to specific event type handlers
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`[EventBus] Error in handler for ${event.type}:`, error);
        }
      });
    }

    // Emit to wildcard handlers
    const wildcardHandlers = this.handlers.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`[EventBus] Error in wildcard handler for ${event.type}:`, error);
        }
      });
    }
  }

  /**
   * Remove a specific subscription
   * @param eventType The event type to unsubscribe from
   * @param handler The handler function to remove
   */
  private unsubscribe<T extends Event>(eventType: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);

      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }

      if (this.debugMode) {
        console.log(
          `[EventBus] Unsubscribed from ${eventType}. Remaining subscribers: ${handlers.size}`
        );
      }
    }
  }

  /**
   * Remove all subscriptions for a specific event type
   * @param eventType The event type to clear subscriptions for
   */
  clear(eventType?: string): void {
    if (eventType) {
      this.handlers.delete(eventType);

      if (this.debugMode) {
        console.log(`[EventBus] Cleared all handlers for ${eventType}`);
      }
    } else {
      this.handlers.clear();

      if (this.debugMode) {
        console.log(`[EventBus] Cleared all event handlers`);
      }
    }
  }

  /**
   * Get the number of subscribers for a specific event type
   * @param eventType The event type to get the count for
   * @returns The number of subscribers
   */
  subscriberCount(eventType: string): number {
    const handlers = this.handlers.get(eventType);
    return handlers ? handlers.size : 0;
  }
}

/**
 * Create a new EventBus instance
 * @param options Configuration options
 * @returns A new EventBus instance
 */
export function createEventBus(options?: { debug?: boolean }): EventBus {
  return new EventBusImpl(options);
}
