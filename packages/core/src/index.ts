/**
 * Model Context Protocol (MCP) Core Package
 *
 * This package provides the core functionality and interfaces for the MCP system.
 */

// Export interfaces
export * from './interfaces/context';
export * from './interfaces/events';

// Export event system implementations
export * from './events/event-bus';

// Export utility functions
// (These will be implemented in future files)
export * from './utils/throttle';
export * from './utils/debounce';
export * from './utils/privacy';

// Export client implementation
export * from './client';

/**
 * MCP Client options
 */
export interface McpOptions {
  /**
   * Privacy level for context filtering
   */
  privacyLevel?: 'strict' | 'balanced' | 'permissive';

  /**
   * Permissions requested by the client
   */
  permissions?: string[];

  /**
   * Scope of context to collect
   */
  scope?: 'current-view' | 'full-page' | 'application';

  /**
   * Whether to enable real-time updates
   */
  realTimeUpdates?: boolean;

  /**
   * Maximum context size in bytes
   */
  maxContextSize?: number;

  /**
   * Context update interval in milliseconds
   */
  updateIntervalMs?: number;
}

/**
 * MCP Client class (placeholder - will be implemented in a separate file)
 */
export class McpClient {
  /**
   * Create a new MCP client
   *
   * @param options - Client options
   */
  constructor(options: McpOptions) {
    // Implementation will be added in a separate file
  }

  /**
   * Update client options
   *
   * @param options - New options to apply
   */
  public updateOptions(options: Partial<McpOptions>): void {
    // Implementation will be added in a separate file
  }

  /**
   * Dispose of the client and clean up resources
   */
  public dispose(): void {
    // Implementation will be added in a separate file
  }

  /**
   * Actions available to the client
   */
  public actions = {
    /**
     * Highlight elements matching the selector
     *
     * @param selector - CSS selector for elements to highlight
     */
    highlight: (selector: string): Promise<void> => {
      // Implementation will be added in a separate file
      return Promise.resolve();
    },

    /**
     * Navigate to a URL
     *
     * @param url - URL to navigate to
     */
    navigate: (url: string): Promise<void> => {
      // Implementation will be added in a separate file
      return Promise.resolve();
    },

    // Additional actions will be added in a separate file
  };
}

/**
 * MCP version
 */
export const VERSION = '1.0.0';
