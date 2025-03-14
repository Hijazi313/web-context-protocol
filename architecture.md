# MCP Architecture

## Project Structure

```
mcp/
├── packages/                      # Monorepo packages
│   ├── core/                      # Core functionality and interfaces
│   │   ├── src/
│   │   │   ├── types/             # TypeScript type definitions
│   │   │   ├── interfaces/        # Core interfaces
│   │   │   ├── utils/             # Shared utilities
│   │   │   ├── events/            # Event system
│   │   │   └── index.ts           # Package entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── context-acquisition/       # Context Acquisition Layer
│   │   ├── src/
│   │   │   ├── dom-observer/      # DOM observation system
│   │   │   ├── interaction-tracker/# User interaction tracking
│   │   │   ├── app-state/         # Application state collection
│   │   │   ├── metadata/          # Page metadata collection
│   │   │   └── index.ts           # Package entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── privacy-filtering/         # Privacy Filtering Layer
│   │   ├── src/
│   │   │   ├── pii-detection/     # PII detection and redaction
│   │   │   ├── content-masking/   # Sensitive content masking
│   │   │   ├── permission/        # Permission management
│   │   │   ├── filters/           # Content filters
│   │   │   └── index.ts           # Package entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── context-processing/        # Context Processing Layer
│   │   ├── src/
│   │   │   ├── normalizer/        # Context normalization
│   │   │   ├── entity-linking/    # Entity recognition and linking
│   │   │   ├── compression/       # Context compression
│   │   │   ├── schemas/           # JSON schemas for context
│   │   │   └── index.ts           # Package entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── model-integration/         # Model Integration Layer
│   │   ├── src/
│   │   │   ├── api/               # API implementation
│   │   │   ├── auth/              # Authentication and authorization
│   │   │   ├── actions/           # Action execution
│   │   │   ├── subscriptions/     # Context subscriptions
│   │   │   └── index.ts           # Package entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── framework-adapters/        # Framework-specific adapters
│   │   ├── react/                 # React adapter
│   │   ├── vue/                   # Vue adapter
│   │   ├── angular/               # Angular adapter
│   │   ├── web-components/        # Web Components adapter
│   │   └── svelte/                # Svelte adapter
│   │
│   ├── chrome-extension/          # Chrome Extension implementation
│   │   ├── src/
│   │   │   ├── background/        # Background service worker
│   │   │   ├── content-scripts/   # Content scripts
│   │   │   ├── ui/                # Extension UI components
│   │   │   ├── storage/           # Storage and persistence
│   │   │   └── manifest.json      # Extension manifest
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── developer-tools/           # Developer tools and utilities
│       ├── src/
│       │   ├── inspector/         # Context inspector
│       │   ├── simulator/         # Context simulator
│       │   ├── code-gen/          # Code generation tools
│       │   ├── testing/           # Testing utilities
│       │   └── index.ts           # Package entry point
│       ├── package.json
│       └── tsconfig.json
│
├── examples/                      # Example implementations
│   ├── react-app/                 # React example
│   ├── vue-app/                   # Vue example
│   ├── vanilla-js/                # Vanilla JS example
│   └── node-server/               # Server-side example
│
├── docs/                          # Documentation
│   ├── api/                       # API documentation
│   ├── guides/                    # Implementation guides
│   ├── architecture/              # Architecture documentation
│   └── examples/                  # Example documentation
│
├── tools/                         # Build and development tools
│   ├── build/                     # Build scripts
│   ├── lint/                      # Linting configuration
│   ├── test/                      # Test configuration
│   └── ci/                        # CI/CD configuration
│
├── package.json                   # Root package.json
├── lerna.json                     # Lerna configuration
├── tsconfig.json                  # Root TypeScript configuration
├── jest.config.js                 # Jest configuration
├── .eslintrc.js                   # ESLint configuration
├── .prettierrc                    # Prettier configuration
└── README.md                      # Project README
```

## Core Files

### 1. Core Package

#### `packages/core/src/interfaces/context.ts`

```typescript
/**
 * Core context interfaces for MCP
 */

export interface ContextMetadata {
  timestamp: number;
  source: string;
  version: string;
  privacyLevel: PrivacyLevel;
}

export interface DOMContext {
  title: string;
  url: string;
  favicon?: string;
  structure: DOMNode;
  selection?: Selection;
  viewport: Viewport;
}

export interface UserContext {
  interactions: Interaction[];
  navigation: NavigationEvent[];
  session: SessionInfo;
}

export interface AppContext {
  state: Record<string, unknown>;
  framework: string;
  frameworkVersion: string;
  components: Component[];
}

export interface Context {
  dom?: DOMContext;
  user?: UserContext;
  app?: AppContext;
  meta: ContextMetadata;
}

export type PrivacyLevel = 'strict' | 'balanced' | 'permissive';

// Additional type definitions...
```

#### `packages/core/src/interfaces/events.ts`

```typescript
/**
 * Event system interfaces
 */

export interface EventOptions {
  once?: boolean;
  priority?: number;
}

export interface EventSubscription {
  unsubscribe: () => void;
}

export interface EventBus {
  emit<T>(eventName: string, data: T): void;
  on<T>(eventName: string, handler: (data: T) => void, options?: EventOptions): EventSubscription;
  once<T>(eventName: string, handler: (data: T) => void): EventSubscription;
  off(eventName: string, handler?: Function): void;
}

export interface ContextEvent {
  type: string;
  data: any;
  timestamp: number;
  source: string;
}
```

### 2. Context Acquisition Layer

#### `packages/context-acquisition/src/dom-observer/dom-observer.ts`

```typescript
import { EventBus, DOMContext, PrivacyLevel } from '@mcp/core';

export interface DOMObserverConfig {
  observeAttributes: boolean;
  observeChildList: boolean;
  observeSubtree: boolean;
  observeCharacterData: boolean;
  throttleMs: number;
  privacyLevel: PrivacyLevel;
  excludeSelectors: string[];
}

export class DOMObserver {
  private config: DOMObserverConfig;
  private mutationObserver: MutationObserver;
  private eventBus: EventBus;
  private privacyFilter: PrivacyFilter;

  constructor(config: DOMObserverConfig, eventBus: EventBus, privacyFilter: PrivacyFilter) {
    this.config = config;
    this.eventBus = eventBus;
    this.privacyFilter = privacyFilter;

    this.mutationObserver = new MutationObserver(
      this.throttle(this.handleMutations.bind(this), config.throttleMs)
    );
  }

  public observe(target: Element): void {
    this.mutationObserver.observe(target, {
      attributes: this.config.observeAttributes,
      childList: this.config.observeChildList,
      subtree: this.config.observeSubtree,
      characterData: this.config.observeCharacterData,
    });
  }

  public disconnect(): void {
    this.mutationObserver.disconnect();
  }

  private handleMutations(mutations: MutationRecord[]): void {
    // Process mutations and emit events
    // Implementation details...
  }

  private throttle(func: Function, limit: number): Function {
    // Throttle implementation
    // Implementation details...
    return function () {};
  }
}
```

### 3. Privacy Filtering Layer

#### `packages/privacy-filtering/src/pii-detection/pii-detector.ts`

```typescript
import { PrivacyLevel } from '@mcp/core';

export interface PIIDetectorConfig {
  patterns: RegExp[];
  sensitivityLevel: number;
  customPatterns?: RegExp[];
}

export class PIIDetector {
  private config: PIIDetectorConfig;

  constructor(config: PIIDetectorConfig) {
    this.config = config;
  }

  public detectPII(text: string): PIIMatch[] {
    // Implementation details...
    return [];
  }

  public redactPII(text: string, privacyLevel: PrivacyLevel): string {
    // Implementation details...
    return '';
  }

  public addPattern(pattern: RegExp): void {
    // Implementation details...
  }
}

export interface PIIMatch {
  type: string;
  value: string;
  start: number;
  end: number;
  confidence: number;
}
```

### 4. Context Processing Layer

#### `packages/context-processing/src/normalizer/context-normalizer.ts`

```typescript
import { Context } from '@mcp/core';

export interface NormalizerConfig {
  schemaVersion: string;
  maxDepth: number;
  includeFields: string[];
  excludeFields: string[];
}

export class ContextNormalizer {
  private config: NormalizerConfig;

  constructor(config: NormalizerConfig) {
    this.config = config;
  }

  public async normalize(rawContext: any): Promise<Context> {
    // Implementation details...
    return {} as Context;
  }

  private validateSchema(context: any): boolean {
    // Implementation details...
    return true;
  }

  private pruneDepth(obj: any, currentDepth: number): any {
    // Implementation details...
    return {};
  }
}
```

### 5. Model Integration Layer

#### `packages/model-integration/src/api/context-api.ts`

```typescript
import { Context, ContextOptions } from '@mcp/core';

export interface ContextAPIConfig {
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  authProvider: AuthProvider;
}

export class ContextAPI {
  private config: ContextAPIConfig;
  private contextManager: ContextManager;

  constructor(config: ContextAPIConfig, contextManager: ContextManager) {
    this.config = config;
    this.contextManager = contextManager;
  }

  public async getCurrentContext(options?: ContextOptions): Promise<Context> {
    // Implementation details...
    return {} as Context;
  }

  public subscribeToContext(
    callback: ContextCallback,
    options?: SubscriptionOptions
  ): Subscription {
    // Implementation details...
    return {
      unsubscribe: () => {},
    };
  }

  public async queryContext(query: ContextQuery): Promise<QueryResult> {
    // Implementation details...
    return {} as QueryResult;
  }
}

export type ContextCallback = (context: Context) => void;
```

### 6. Chrome Extension

#### `packages/chrome-extension/src/manifest.json`

```json
{
  "manifest_version": 3,
  "name": "Model Context Protocol",
  "version": "1.0.0",
  "description": "A protocol for AI models to securely access and utilize web context",
  "permissions": ["storage", "activeTab", "scripting"],
  "host_permissions": ["<all_urls>"],
  "background": {
    "service_worker": "background/index.js"
  },
  "action": {
    "default_popup": "ui/popup.html",
    "default_icon": {
      "16": "assets/icon16.png",
      "48": "assets/icon48.png",
      "128": "assets/icon128.png"
    }
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content-scripts/index.js"]
    }
  ],
  "options_page": "ui/options.html",
  "icons": {
    "16": "assets/icon16.png",
    "48": "assets/icon48.png",
    "128": "assets/icon128.png"
  }
}
```

#### `packages/chrome-extension/src/background/service.ts`

```typescript
import { EventBus, Context, PrivacyLevel } from '@mcp/core';

export class McpBackgroundService {
  private contextManager: ContextManager;
  private privacyManager: PrivacyManager;
  private apiServer: ApiServer;
  private eventBus: EventBus;

  constructor() {
    this.eventBus = new EventBus();
    this.contextManager = new ContextManager(this.eventBus);
    this.privacyManager = new PrivacyManager();
    this.apiServer = new ApiServer({
      contextManager: this.contextManager,
      privacyManager: this.privacyManager,
      eventBus: this.eventBus,
    });

    this.setupMessageListeners();
    this.setupConnectionListeners();
  }

  private setupMessageListeners(): void {
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }

  private setupConnectionListeners(): void {
    chrome.runtime.onConnect.addListener(this.handleConnection.bind(this));
  }

  private handleMessage(
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ): boolean {
    // Implementation details...
    return true;
  }

  private handleConnection(port: chrome.runtime.Port): void {
    // Implementation details...
  }
}
```

### 7. Framework Adapters

#### `packages/framework-adapters/react/src/McpProvider.tsx`

```typescript
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Context, McpClient, McpOptions } from '@mcp/core';

interface McpContextValue {
  context: Context | null;
  actions: Record<string, Function>;
  isLoading: boolean;
  error: Error | null;
  client?: McpClient;
}

interface McpProviderProps {
  children: React.ReactNode;
  config: McpOptions;
}

const McpContext = createContext<McpContextValue | null>(null);

export function McpProvider({ children, config }: McpProviderProps): React.ReactElement {
  const [contextValue, setContextValue] = useState<Context | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [client, setClient] = useState<McpClient | null>(null);

  useEffect(() => {
    const mcpClient = new McpClient(config);
    setClient(mcpClient);

    const subscription = mcpClient.subscribeToContext(
      newContext => {
        setContextValue(newContext);
        setIsLoading(false);
      },
      err => {
        setError(err);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      mcpClient.dispose();
    };
  }, [config]);

  const actions = useMemo(() => {
    if (!client) return {};

    return {
      highlight: (selector: string) => client.actions.highlight(selector),
      navigate: (url: string) => client.actions.navigate(url),
      // Other actions...
    };
  }, [client]);

  const value = {
    context: contextValue,
    actions,
    isLoading,
    error,
    client,
  };

  return <McpContext.Provider value={value}>{children}</McpContext.Provider>;
}

export function useMcpContext(options?: McpOptions): McpContextValue {
  const context = useContext(McpContext);

  if (!context) {
    throw new Error('useMcpContext must be used within a McpProvider');
  }

  useEffect(() => {
    if (options && context.client) {
      context.client.updateOptions(options);
    }
  }, [options, context.client]);

  return context;
}
```

## Development Environment Setup

### Root `package.json`

```json
{
  "name": "mcp",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "lerna run build",
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "clean": "lerna clean",
    "bootstrap": "lerna bootstrap",
    "start:extension": "cd packages/chrome-extension && npm start",
    "start:examples": "lerna run --scope @mcp/examples-* start --parallel",
    "docs": "typedoc"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^18.15.11",
    "@typescript-eslint/eslint-plugin": "^5.57.1",
    "@typescript-eslint/parser": "^5.57.1",
    "eslint": "^8.37.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-prettier": "^4.2.1",
    "jest": "^29.5.0",
    "lerna": "^6.6.1",
    "prettier": "^2.8.7",
    "ts-jest": "^29.1.0",
    "typedoc": "^0.24.1",
    "typescript": "^5.0.3"
  }
}
```

### Root `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "jsx": "react",
    "baseUrl": ".",
    "paths": {
      "@mcp/*": ["packages/*/src"]
    }
  },
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### `lerna.json`

```json
{
  "version": "1.0.0",
  "npmClient": "npm",
  "useWorkspaces": true,
  "packages": ["packages/*"],
  "command": {
    "publish": {
      "conventionalCommits": true,
      "message": "chore(release): publish %s"
    }
  }
}
```
