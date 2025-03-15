/**
 * Type declarations for @mcp/browser
 * 
 * This file provides TypeScript type definitions for the MCP browser package,
 * which contains browser-specific context acquisition functionality.
 */

declare module '@mcp/browser' {
  export interface BrowserContextProviderOptions {
    observeDomMutations?: boolean;
    trackUserInteractions?: boolean;
    trackNavigation?: boolean;
    maxDomDepth?: number;
  }

  export function createBrowserContextProvider(options?: BrowserContextProviderOptions): BrowserContextProvider;

  export interface BrowserContextProvider {
    getDomContext(): any;
    getUserContext(): any;
    getAppContext(): any;
    getContext(): any;
    dispose(): void;
  }
} 