/**
 * Model Package for the Model Context Protocol
 *
 * This package provides model integration and API for the Model Context Protocol.
 */

// Import from relative path to fix module resolution during development
import {
  Context,
  ContextQuery,
  QueryResult,
  PrivacyLevel,
} from '../../core/src/interfaces/context';
import { createEventBus, EventBus } from '../../core/src/events/event-bus';
import { PrivacyFilter } from '../../privacy/src/index';
import { ContextProcessor } from '../../processing/src/index';

/**
 * Model client options
 */
export interface ModelClientOptions {
  /**
   * Privacy level to apply
   */
  privacyLevel: PrivacyLevel;

  /**
   * Permissions for context acquisition
   */
  permissions: string[];

  /**
   * Scope of context acquisition
   */
  scope: 'current-page' | 'all-pages' | 'domain';

  /**
   * Whether to enable real-time updates
   */
  realTimeUpdates: boolean;

  /**
   * Maximum size of context in bytes
   */
  maxContextSize?: number;

  /**
   * Interval in milliseconds for context updates
   */
  updateIntervalMs?: number;

  /**
   * Base URL for the model API
   */
  apiBaseUrl?: string;

  /**
   * API key for the model API
   */
  apiKey?: string;
}

/**
 * Model action options
 */
export interface ModelActionOptions {
  /**
   * Timeout in milliseconds
   */
  timeout?: number;

  /**
   * Whether to wait for the action to complete
   */
  waitForCompletion?: boolean;
}

/**
 * Model client for integrating with AI models
 */
export class ModelClient {
  private options: ModelClientOptions;
  private eventBus: EventBus;
  private privacyFilter: PrivacyFilter | null = null;
  private contextProcessor: ContextProcessor | null = null;
  private contextProvider: any = null;

  /**
   * Create a new model client
   * @param options Model client options
   */
  constructor(options: ModelClientOptions) {
    this.options = {
      privacyLevel: 'balanced',
      permissions: ['dom', 'interaction'],
      scope: 'current-page',
      realTimeUpdates: true,
      maxContextSize: 1024 * 1024, // 1MB
      updateIntervalMs: 1000,
      ...options,
    };

    this.eventBus = createEventBus({ debug: false });
  }

  /**
   * Initialize the model client with a context provider
   * @param provider Context provider
   */
  public initialize(provider: any): void {
    this.contextProvider = provider;

    // Initialize the privacy filter
    this.privacyFilter = new PrivacyFilter({
      privacyLevel: this.options.privacyLevel,
    });

    // Initialize the context processor
    this.contextProcessor = new ContextProcessor();
    this.contextProcessor.setPrivacyFilter(this.privacyFilter);

    // Initialize the context provider
    if (this.contextProvider && typeof this.contextProvider.initialize === 'function') {
      this.contextProvider.initialize();
    }
  }

  /**
   * Update client options
   * @param options New options
   */
  public updateOptions(options: Partial<ModelClientOptions>): void {
    this.options = {
      ...this.options,
      ...options,
    };

    // Update privacy filter if privacy level changed
    if (options.privacyLevel && this.privacyFilter) {
      this.privacyFilter = new PrivacyFilter({
        privacyLevel: options.privacyLevel,
      });

      if (this.contextProcessor) {
        this.contextProcessor.setPrivacyFilter(this.privacyFilter);
      }
    }
  }

  /**
   * Get context based on query
   * @param query Context query
   * @returns Query result with context
   */
  public async getContext(query: ContextQuery): Promise<QueryResult> {
    if (!this.contextProvider) {
      throw new Error('Context provider not initialized');
    }

    try {
      // Get context from provider
      const result = await this.contextProvider.getContext({
        ...query,
        privacyLevel: this.options.privacyLevel,
      });

      // Process context if processor is available
      if (this.contextProcessor && result.context) {
        result.context = this.contextProcessor.processContext(result.context as Context, query);
      }

      return result;
    } catch (error) {
      return {
        context: {},
        executionTime: 0,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Highlight an element in the DOM
   * @param selector CSS selector for the element
   * @param options Action options
   * @returns Promise that resolves when the action is complete
   */
  public async highlightElement(selector: string, options?: ModelActionOptions): Promise<boolean> {
    if (!this.contextProvider) {
      throw new Error('Context provider not initialized');
    }

    try {
      // Implementation would depend on the context provider
      console.log(`Highlighting element: ${selector}`);
      return true;
    } catch (error) {
      console.error('Error highlighting element:', error);
      return false;
    }
  }

  /**
   * Navigate to a URL
   * @param url URL to navigate to
   * @param options Action options
   * @returns Promise that resolves when the action is complete
   */
  public async navigateTo(url: string, options?: ModelActionOptions): Promise<boolean> {
    if (!this.contextProvider) {
      throw new Error('Context provider not initialized');
    }

    try {
      // Implementation would depend on the context provider
      console.log(`Navigating to: ${url}`);
      return true;
    } catch (error) {
      console.error('Error navigating to URL:', error);
      return false;
    }
  }

  /**
   * Execute a custom action
   * @param action Action to execute
   * @param params Action parameters
   * @param options Action options
   * @returns Promise that resolves with the action result
   */
  public async executeAction(
    action: string,
    params: any,
    options?: ModelActionOptions
  ): Promise<any> {
    if (!this.contextProvider) {
      throw new Error('Context provider not initialized');
    }

    try {
      // Implementation would depend on the context provider
      console.log(`Executing action: ${action}`, params);
      return { success: true };
    } catch (error) {
      console.error(`Error executing action ${action}:`, error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Dispose the model client
   */
  public dispose(): void {
    // Dispose the context provider
    if (this.contextProvider && typeof this.contextProvider.dispose === 'function') {
      this.contextProvider.dispose();
    }

    // Clear event bus
    this.eventBus.clear();

    // Clear references
    this.contextProvider = null;
    this.privacyFilter = null;
    this.contextProcessor = null;
  }
}

/**
 * Create a new model client
 * @param options Model client options
 * @returns A new model client
 */
export function createModelClient(options: ModelClientOptions): ModelClient {
  return new ModelClient(options);
}
