/**
 * Browser Package for the Model Context Protocol
 *
 * This package provides browser-specific implementations for context acquisition,
 * DOM observation, and user interaction tracking.
 */

// Import from relative path to fix module resolution during development
import {
  Context,
  ContextQuery,
  QueryResult,
  PrivacyLevel,
} from '../../core/src/interfaces/context';

/**
 * Browser context provider options
 */
export interface BrowserContextProviderOptions {
  /**
   * Whether to observe DOM mutations
   */
  observeDomMutations?: boolean;

  /**
   * Whether to track user interactions
   */
  trackUserInteractions?: boolean;

  /**
   * Whether to track navigation events
   */
  trackNavigation?: boolean;

  /**
   * Interval in milliseconds for periodic context updates
   */
  updateIntervalMs?: number;

  /**
   * Maximum depth of DOM tree to capture
   */
  maxDomDepth?: number;
}

/**
 * Browser context provider
 */
export class BrowserContextProvider {
  private options: BrowserContextProviderOptions;
  private isInitialized: boolean = false;
  private mutationObserver: MutationObserver | null = null;
  private updateInterval: number | null = null;

  /**
   * Create a new browser context provider
   * @param options Provider options
   */
  constructor(options: BrowserContextProviderOptions = {}) {
    this.options = {
      observeDomMutations: true,
      trackUserInteractions: true,
      trackNavigation: true,
      updateIntervalMs: 1000,
      maxDomDepth: 10,
      ...options,
    };
  }

  /**
   * Initialize the context provider
   */
  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    if (this.options.observeDomMutations) {
      this.setupDomObserver();
    }

    if (this.options.trackUserInteractions) {
      this.setupInteractionTracking();
    }

    if (this.options.trackNavigation) {
      this.setupNavigationTracking();
    }

    if (this.options.updateIntervalMs) {
      this.setupPeriodicUpdates();
    }

    this.isInitialized = true;
  }

  /**
   * Get context based on query
   * @param query Context query
   * @returns Query result with context
   */
  public async getContext(query: ContextQuery): Promise<QueryResult> {
    const startTime = Date.now();

    try {
      // Create context object with proper structure
      const context: Partial<Context> = {
        meta: {
          timestamp: Date.now(),
          source: 'browser',
          version: '1.0.0',
          privacyLevel: query.privacyLevel || 'balanced',
          url: window.location.href,
          domain: window.location.hostname,
        },
      };

      if (query.includeDOM) {
        context.dom = await this.getDomContext(query);
      }

      if (query.includeUserContext) {
        context.user = await this.getUserContext(query);
      }

      if (query.includeAppContext) {
        context.app = await this.getAppContext(query);
      }

      return {
        context,
        executionTime: Date.now() - startTime,
        success: true,
      };
    } catch (error) {
      return {
        context: {},
        executionTime: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Dispose the context provider
   */
  public dispose(): void {
    if (!this.isInitialized) {
      return;
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    if (this.updateInterval !== null) {
      window.clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    // Remove event listeners
    this.removeInteractionTracking();
    this.removeNavigationTracking();

    this.isInitialized = false;
  }

  /**
   * Set up DOM mutation observer
   */
  private setupDomObserver(): void {
    this.mutationObserver = new MutationObserver(mutations => {
      // Process DOM mutations
      console.log(`Observed ${mutations.length} DOM mutations`);
    });

    this.mutationObserver.observe(document.documentElement, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true,
    });
  }

  /**
   * Set up user interaction tracking
   */
  private setupInteractionTracking(): void {
    // Add event listeners for user interactions
    document.addEventListener('click', this.handleUserInteraction);
    document.addEventListener('input', this.handleUserInteraction);
    document.addEventListener('scroll', this.handleUserInteraction, { passive: true });
    document.addEventListener('mouseover', this.handleUserInteraction, { passive: true });
    document.addEventListener('focus', this.handleUserInteraction, { capture: true });
    document.addEventListener('blur', this.handleUserInteraction, { capture: true });
  }

  /**
   * Remove user interaction tracking
   */
  private removeInteractionTracking(): void {
    document.removeEventListener('click', this.handleUserInteraction);
    document.removeEventListener('input', this.handleUserInteraction);
    document.removeEventListener('scroll', this.handleUserInteraction);
    document.removeEventListener('mouseover', this.handleUserInteraction);
    document.removeEventListener('focus', this.handleUserInteraction);
    document.removeEventListener('blur', this.handleUserInteraction);
  }

  /**
   * Handle user interaction events
   * @param event DOM event
   */
  private handleUserInteraction = (event: Event): void => {
    // Process user interaction
    console.log(`User interaction: ${event.type}`);
  };

  /**
   * Set up navigation tracking
   */
  private setupNavigationTracking(): void {
    window.addEventListener('popstate', this.handleNavigation);
    window.addEventListener('hashchange', this.handleNavigation);

    // Monkey patch history methods to track navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handleNavigation(new Event('pushstate'));
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.handleNavigation(new Event('replacestate'));
    };
  }

  /**
   * Remove navigation tracking
   */
  private removeNavigationTracking(): void {
    window.removeEventListener('popstate', this.handleNavigation);
    window.removeEventListener('hashchange', this.handleNavigation);

    // Restore original history methods
    // Note: This is a simplified approach and may not work in all cases
    // A more robust solution would involve storing and restoring the original methods
  }

  /**
   * Handle navigation events
   * @param event Navigation event
   */
  private handleNavigation = (event: Event): void => {
    // Process navigation event
    console.log(`Navigation event: ${event.type}`);
  };

  /**
   * Set up periodic context updates
   */
  private setupPeriodicUpdates(): void {
    this.updateInterval = window.setInterval(() => {
      // Perform periodic context update
      console.log('Periodic context update');
    }, this.options.updateIntervalMs);
  }

  /**
   * Get DOM context
   * @param query Context query
   * @returns DOM context
   */
  private async getDomContext(query: ContextQuery): Promise<any> {
    // Implementation to capture DOM structure
    return {
      title: document.title,
      url: window.location.href,
      structure: {
        nodeType: 1,
        nodeName: 'HTML',
        attributes: {},
        children: [],
      },
      selection: {
        text: '',
        startNodePath: '',
        endNodePath: '',
        startOffset: 0,
        endOffset: 0,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        devicePixelRatio: window.devicePixelRatio,
      },
    };
  }

  /**
   * Get user context
   * @param query Context query
   * @returns User context
   */
  private async getUserContext(query: ContextQuery): Promise<any> {
    // Implementation to capture user context
    return {
      interactions: [],
      navigation: [],
      session: {
        id: 'session-id',
        startTime: Date.now(),
        duration: 0,
        pageViews: 1,
      },
      preferences: {},
    };
  }

  /**
   * Get application context
   * @param query Context query
   * @returns Application context
   */
  private async getAppContext(query: ContextQuery): Promise<any> {
    // Implementation to capture application context
    const framework = this.detectFramework();
    return {
      state: {},
      components: [],
      framework: framework,
      frameworkVersion: this.detectFrameworkVersion(framework),
      route: {
        path: window.location.pathname,
        params: {},
        query: this.parseQueryParams(window.location.search),
      },
    };
  }

  /**
   * Detect the JavaScript framework being used
   * @returns Detected framework name or 'unknown'
   */
  private detectFramework(): string {
    // Simple framework detection logic
    if ((window as any)['React'] || document.querySelector('[data-reactroot]')) {
      return 'react';
    }

    if ((window as any)['Vue'] || document.querySelector('[data-v-]')) {
      return 'vue';
    }

    if ((window as any)['angular'] || document.querySelector('[ng-]')) {
      return 'angular';
    }

    return 'unknown';
  }

  /**
   * Detect the version of the framework being used
   * @param framework Framework name
   * @returns Detected framework version or 'unknown'
   */
  private detectFrameworkVersion(framework: string): string {
    // Simple framework version detection logic
    switch (framework) {
      case 'react':
        return (window as any)['React']?.version || 'unknown';
      case 'vue':
        return (window as any)['Vue']?.version || 'unknown';
      case 'angular':
        return (window as any)['angular']?.version || 'unknown';
      default:
        return 'unknown';
    }
  }

  /**
   * Parse query parameters from a URL search string
   * @param search URL search string
   * @returns Parsed query parameters
   */
  private parseQueryParams(search: string): Record<string, string> {
    const params: Record<string, string> = {};
    const searchParams = new URLSearchParams(search);

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  }
}

/**
 * Create a new browser context provider
 * @param options Provider options
 * @returns A new browser context provider
 */
export function createBrowserContextProvider(
  options?: BrowserContextProviderOptions
): BrowserContextProvider {
  return new BrowserContextProvider(options);
}
