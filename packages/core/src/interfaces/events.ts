/**
 * Event System Interfaces for the Model Context Protocol
 *
 * This file defines the interfaces for the event system used throughout the MCP architecture.
 * It includes event types, event handlers, and the event bus interface.
 */

/**
 * Base event interface that all events must implement
 */
export interface Event {
  type: string;
  timestamp: number;
  source?: string;
}

/**
 * Context update event
 */
export interface ContextUpdateEvent extends Event {
  type: 'context:update';
  contextType: 'dom' | 'user' | 'app' | 'full';
  data: any;
}

/**
 * Privacy level change event
 */
export interface PrivacyLevelChangeEvent extends Event {
  type: 'privacy:change';
  previousLevel: string;
  newLevel: string;
}

/**
 * Navigation event
 */
export interface NavigationChangeEvent extends Event {
  type: 'navigation';
  url: string;
  title?: string;
  referrer?: string;
}

/**
 * User interaction event
 */
export interface UserInteractionEvent extends Event {
  type: 'interaction';
  interactionType: 'click' | 'input' | 'scroll' | 'hover' | 'focus' | 'blur';
  target?: {
    selector?: string;
    nodeType?: number;
    nodeName?: string;
  };
  value?: any;
}

/**
 * Error event
 */
export interface ErrorEvent extends Event {
  type: 'error';
  errorType: 'system' | 'context' | 'privacy' | 'connection';
  message: string;
  stack?: string;
  code?: string | number;
}

/**
 * Event handler function type
 */
export type EventHandler<T extends Event = Event> = (event: T) => void;

/**
 * Event bus interface
 */
export interface EventBus {
  /**
   * Subscribe to an event
   * @param eventType The event type to subscribe to
   * @param handler The handler function to call when the event is emitted
   * @returns A function to unsubscribe the handler
   */
  subscribe<T extends Event>(eventType: string, handler: EventHandler<T>): () => void;

  /**
   * Emit an event
   * @param event The event to emit
   */
  emit<T extends Event>(event: T): void;

  /**
   * Remove all subscriptions for a specific event type
   * @param eventType The event type to clear subscriptions for
   */
  clear(eventType?: string): void;

  /**
   * Get the number of subscribers for a specific event type
   * @param eventType The event type to get the count for
   * @returns The number of subscribers
   */
  subscriberCount(eventType: string): number;
}
