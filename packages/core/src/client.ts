/**
 * MCP Client Implementation
 *
 * This file provides the implementation of the McpClient class, which is the main entry point
 * for applications using the Model Context Protocol.
 */

import { EventBus, createEventBus } from './events/event-bus';
import { Context, ContextQuery, QueryResult, PrivacyLevel } from './interfaces/context';
import { McpOptions } from './index';

/**
 * Context provider interface
 */
export interface ContextProvider {
  initialize(): void;
  getContext(query: ContextQuery): Promise<QueryResult>;
  dispose(): void;
}

/**
 * MCP Client class
 */
export class McpClient {
  private options: McpOptions;
  private eventBus: EventBus;
  private provider: ContextProvider | null = null;
  private updateInterval: number | null = null;

  /**
   * Create a new MCP client
   *
   * @param options - Client options
   */
  constructor(options: McpOptions) {
    this.options = {
      privacyLevel: 'balanced',
      permissions: [],
      scope: 'current-view',
      realTimeUpdates: false,
      maxContextSize: 1024 * 1024, // 1MB
      updateIntervalMs: 1000,
      ...options,
    };

    this.eventBus = createEventBus({ debug: false });
  }

  /**
   * Initialize the client with a context provider
   *
   * @param provider - Context provider
   */
  public initialize(provider: ContextProvider): void {
    this.provider = provider;
    this.provider.initialize();

    if (this.options.realTimeUpdates && this.options.updateIntervalMs) {
      this.setupPeriodicUpdates();
    }

    // Emit initialization event
    this.eventBus.emit({
      type: 'mcp:initialized',
      timestamp: Date.now(),
      source: 'mcp-client',
    });
  }

  /**
   * Update client options
   *
   * @param options - New options to apply
   */
  public updateOptions(options: Partial<McpOptions>): void {
    const previousOptions = { ...this.options };
    this.options = { ...this.options, ...options };

    // Handle real-time updates changes
    if (options.realTimeUpdates !== undefined) {
      if (options.realTimeUpdates && !previousOptions.realTimeUpdates) {
        this.setupPeriodicUpdates();
      } else if (!options.realTimeUpdates && previousOptions.realTimeUpdates) {
        this.clearPeriodicUpdates();
      }
    }

    // Handle update interval changes
    if (
      options.updateIntervalMs !== undefined &&
      options.updateIntervalMs !== previousOptions.updateIntervalMs &&
      this.options.realTimeUpdates
    ) {
      this.clearPeriodicUpdates();
      this.setupPeriodicUpdates();
    }

    // Emit options updated event
    this.eventBus.emit({
      type: 'mcp:options-updated',
      timestamp: Date.now(),
      source: 'mcp-client',
      data: { previousOptions, newOptions: this.options },
    });
  }

  /**
   * Get context based on query
   *
   * @param query - Context query
   * @returns Promise resolving to query result
   */
  public async getContext(query?: Partial<ContextQuery>): Promise<QueryResult> {
    if (!this.provider) {
      throw new Error('MCP client not initialized with a provider');
    }

    const fullQuery: ContextQuery = {
      includeDOM: true,
      includeUserContext: true,
      includeAppContext: true,
      privacyLevel: this.options.privacyLevel as PrivacyLevel,
      ...query,
    };

    try {
      const result = await this.provider.getContext(fullQuery);

      // Emit context updated event
      this.eventBus.emit({
        type: 'context:update',
        timestamp: Date.now(),
        source: 'mcp-client',
        contextType: 'full',
        data: result.context,
      });

      return result;
    } catch (error) {
      // Emit error event
      this.eventBus.emit({
        type: 'error',
        timestamp: Date.now(),
        source: 'mcp-client',
        errorType: 'context',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      return {
        context: {},
        executionTime: 0,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Subscribe to events
   *
   * @param eventType - Event type to subscribe to
   * @param handler - Event handler
   * @returns Unsubscribe function
   */
  public subscribe(eventType: string, handler: (event: any) => void): () => void {
    return this.eventBus.subscribe(eventType, handler);
  }

  /**
   * Dispose of the client and clean up resources
   */
  public dispose(): void {
    this.clearPeriodicUpdates();

    if (this.provider) {
      this.provider.dispose();
      this.provider = null;
    }

    this.eventBus.clear();

    // Emit disposed event
    this.eventBus.emit({
      type: 'mcp:disposed',
      timestamp: Date.now(),
      source: 'mcp-client',
    });
  }

  /**
   * Set up periodic context updates
   */
  private setupPeriodicUpdates(): void {
    if (this.updateInterval !== null) {
      this.clearPeriodicUpdates();
    }

    this.updateInterval = window.setInterval(async () => {
      if (this.provider) {
        try {
          const result = await this.provider.getContext({
            includeDOM: true,
            includeUserContext: true,
            includeAppContext: true,
            privacyLevel: this.options.privacyLevel as PrivacyLevel,
          });

          if (result.success) {
            // Emit context updated event
            this.eventBus.emit({
              type: 'context:update',
              timestamp: Date.now(),
              source: 'mcp-client',
              contextType: 'full',
              data: result.context,
            });
          }
        } catch (error) {
          console.error('Error during periodic context update:', error);
        }
      }
    }, this.options.updateIntervalMs);
  }

  /**
   * Clear periodic context updates
   */
  private clearPeriodicUpdates(): void {
    if (this.updateInterval !== null) {
      window.clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Actions available to the client
   */
  public actions = {
    /**
     * Highlight elements matching the selector
     *
     * @param selector - CSS selector for elements to highlight
     * @returns Promise resolving when the action is complete
     */
    highlight: async (selector: string): Promise<void> => {
      if (!this.provider) {
        throw new Error('MCP client not initialized with a provider');
      }

      try {
        // Implementation would depend on the provider's capabilities
        console.log(`Highlighting elements matching selector: ${selector}`);

        // Emit action event
        this.eventBus.emit({
          type: 'action:highlight',
          timestamp: Date.now(),
          source: 'mcp-client',
          data: { selector },
        });
      } catch (error) {
        console.error('Error highlighting elements:', error);
        throw error;
      }
    },

    /**
     * Navigate to a URL
     *
     * @param url - URL to navigate to
     * @returns Promise resolving when the action is complete
     */
    navigate: async (url: string): Promise<void> => {
      if (!this.provider) {
        throw new Error('MCP client not initialized with a provider');
      }

      try {
        // Implementation would depend on the provider's capabilities
        console.log(`Navigating to URL: ${url}`);

        // Emit action event
        this.eventBus.emit({
          type: 'action:navigate',
          timestamp: Date.now(),
          source: 'mcp-client',
          data: { url },
        });

        // Simple implementation for browser environments
        if (typeof window !== 'undefined') {
          window.location.href = url;
        }
      } catch (error) {
        console.error('Error navigating to URL:', error);
        throw error;
      }
    },

    /**
     * Execute a custom action
     *
     * @param action - Action name
     * @param params - Action parameters
     * @returns Promise resolving with the action result
     */
    execute: async (action: string, params: any): Promise<any> => {
      if (!this.provider) {
        throw new Error('MCP client not initialized with a provider');
      }

      try {
        // Implementation would depend on the provider's capabilities
        console.log(`Executing action: ${action}`, params);

        // Emit action event
        this.eventBus.emit({
          type: `action:${action}`,
          timestamp: Date.now(),
          source: 'mcp-client',
          data: params,
        });

        return { success: true };
      } catch (error) {
        console.error(`Error executing action ${action}:`, error);
        throw error;
      }
    },
  };
}

/**
 * Create a new MCP client
 *
 * @param options - Client options
 * @returns A new MCP client instance
 */
export function createMcpClient(options: McpOptions): McpClient {
  return new McpClient(options);
}
