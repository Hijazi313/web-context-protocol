/**
 * Type declarations for @mcp/core
 * 
 * This file provides TypeScript type definitions for the MCP core package,
 * which contains the core interfaces and functionality for the Model Context Protocol.
 */

declare module '@mcp/core' {
  export enum PrivacyLevel {
    STRICT = 0,
    BALANCED = 1,
    PERMISSIVE = 2
  }

  export interface Context {
    domContext?: DomContext;
    userContext?: UserContext;
    appContext?: AppContext;
    metadata?: ContextMetadata;
  }

  export interface DomContext {
    title?: string;
    url?: string;
    domTree?: any;
    visibleElements?: any[];
    focusedElement?: any;
    metadata?: any;
  }

  export interface UserContext {
    interactions?: UserInteraction[];
    navigation?: NavigationHistory;
    preferences?: UserPreferences;
    metadata?: any;
  }

  export interface AppContext {
    framework?: string;
    frameworkVersion?: string;
    state?: any;
    components?: any[];
    routes?: any[];
    metadata?: any;
  }

  export interface ContextMetadata {
    timestamp: number;
    version: string;
    privacyLevel: PrivacyLevel;
    source: string;
  }

  export interface UserInteraction {
    type: string;
    timestamp: number;
    element?: any;
    data?: any;
  }

  export interface NavigationHistory {
    current: string;
    previous?: string;
    history?: string[];
  }

  export interface UserPreferences {
    theme?: string;
    language?: string;
    [key: string]: any;
  }

  export interface McpOptions {
    privacyLevel: PrivacyLevel;
    provider?: any;
    contextSizeLimit?: number;
    updateIntervalMs?: number;
  }

  export function createMcpClient(options: McpOptions): McpClient;

  export interface McpClient {
    getContext(): Context;
    updateOptions(options: Partial<McpOptions>): void;
    getOptions(): McpOptions;
    dispose(): void;
  }
} 