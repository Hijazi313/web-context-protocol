# Model Context Protocol - API Reference

This document provides a reference for the API of the Model Context Protocol (MCP).

## Core Package (`@mcp/core`)

### Context Interfaces

#### `PrivacyLevel`

```typescript
type PrivacyLevel = 'strict' | 'balanced' | 'permissive';

const PrivacyLevel = {
  STRICT: 'strict',
  BALANCED: 'balanced',
  PERMISSIVE: 'permissive',
};
```

#### `ContextMetadata`

```typescript
interface ContextMetadata {
  timestamp: number;
  source: string;
  version: string;
  privacyLevel: PrivacyLevel;
  url: string;
  domain: string;
}
```

#### `DOMNode`

```typescript
interface DOMNode {
  nodeType: number;
  nodeName: string;
  attributes?: Record<string, string>;
  classList?: string[];
  textContent?: string;
  children?: DOMNode[];
  boundingRect?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
  };
  styles?: Record<string, string>;
  accessibility?: {
    role?: string;
    label?: string;
    description?: string;
  };
}
```

#### `Selection`

```typescript
interface Selection {
  text: string;
  startNodePath: string;
  endNodePath: string;
  startOffset: number;
  endOffset: number;
}
```

#### `Viewport`

```typescript
interface Viewport {
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
  devicePixelRatio: number;
}
```

#### `Interaction`

```typescript
interface Interaction {
  type: 'click' | 'scroll' | 'hover' | 'keypress' | 'focus' | 'blur' | 'input';
  timestamp: number;
  targetPath?: string;
  targetTagName?: string;
  data?: any;
}
```

#### `NavigationHistoryEvent`

```typescript
interface NavigationHistoryEvent {
  type: 'pageload' | 'hashchange' | 'popstate' | 'pushstate' | 'replacestate';
  timestamp: number;
  fromUrl?: string;
  toUrl: string;
}
```

#### `SessionInfo`

```typescript
interface SessionInfo {
  id: string;
  startTime: number;
  duration: number;
  pageViews?: number;
  interactionCount?: number;
}
```

#### `Component`

```typescript
interface Component {
  name: string;
  type: string;
  props?: Record<string, any>;
  state?: Record<string, any>;
  children?: Component[];
}
```

#### `DOMContext`

```typescript
interface DOMContext {
  title: string;
  url: string;
  favicon?: string;
  structure: DOMNode;
  selection?: Selection;
  viewport: Viewport;
  meta?: Record<string, string>;
  dialogs?: DOMNode[];
}
```

#### `UserContext`

```typescript
interface UserContext {
  interactions: Interaction[];
  navigation: NavigationHistoryEvent[];
  session: SessionInfo;
  preferences?: Record<string, any>;
}
```

#### `AppContext`

```typescript
interface AppContext {
  state: Record<string, unknown>;
  framework: string;
  frameworkVersion: string;
  components: Component[];
  route?: {
    path: string;
    params: Record<string, string>;
    query: Record<string, string>;
  };
  errors?: Array<{
    message: string;
    stack?: string;
    timestamp: number;
  }>;
}
```

#### `Context`

```typescript
interface Context {
  dom?: DOMContext;
  user?: UserContext;
  app?: AppContext;
  meta: ContextMetadata;
}
```

#### `ContextQuery`

```typescript
interface ContextQuery {
  includeDOM?: boolean;
  includeUserContext?: boolean;
  includeAppContext?: boolean;
  selector?: string;
  path?: string;
  filter?: Record<string, any>;
  limit?: number;
  maxDepth?: number;
  privacyLevel?: PrivacyLevel;
}
```

#### `QueryResult`

```typescript
interface QueryResult {
  context: Partial<Context>;
  executionTime: number;
  success: boolean;
  error?: string;
}
```

### Event Interfaces

#### `Event`

```typescript
interface Event {
  type: string;
  timestamp: number;
  source?: string;
}
```

#### `ContextUpdateEvent`

```typescript
interface ContextUpdateEvent extends Event {
  type: 'context:update';
  contextType: 'dom' | 'user' | 'app' | 'full';
  data: any;
}
```

#### `PrivacyLevelChangeEvent`

```typescript
interface PrivacyLevelChangeEvent extends Event {
  type: 'privacy:change';
  previousLevel: string;
  newLevel: string;
}
```

#### `NavigationChangeEvent`

```typescript
interface NavigationChangeEvent extends Event {
  type: 'navigation';
  url: string;
  title?: string;
  referrer?: string;
}
```

#### `UserInteractionEvent`

```typescript
interface UserInteractionEvent extends Event {
  type: 'interaction';
  interactionType: 'click' | 'input' | 'scroll' | 'hover' | 'focus' | 'blur';
  target?: {
    selector?: string;
    nodeType?: number;
    nodeName?: string;
  };
  value?: any;
}
```

#### `ErrorEvent`

```typescript
interface ErrorEvent extends Event {
  type: 'error';
  errorType: 'system' | 'context' | 'privacy' | 'connection';
  message: string;
  stack?: string;
  code?: string | number;
}
```

#### `EventHandler`

```typescript
type EventHandler<T extends Event = Event> = (event: T) => void;
```

#### `EventBus`

```typescript
interface EventBus {
  subscribe<T extends Event>(eventType: string, handler: EventHandler<T>): () => void;
  emit<T extends Event>(event: T): void;
  clear(eventType?: string): void;
  subscriberCount(eventType: string): number;
}
```

### Utility Functions

#### `throttle`

```typescript
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => ReturnType<T>;
```

#### `throttleAsync`

```typescript
function throttleAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>;
```

#### `debounce`

```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void;
```

#### `debounceAsync`

```typescript
function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>;
```

#### `containsPII`

```typescript
function containsPII(text: string): boolean;
```

#### `redactPII`

```typescript
function redactPII(text: string): string;
```

#### `isSensitiveElement`

```typescript
function isSensitiveElement(element: Element): boolean;
```

#### `getPrivacySettings`

```typescript
function getPrivacySettings(privacyLevel: PrivacyLevel): any;
```

#### `isPermissionAllowed`

```typescript
function isPermissionAllowed(permission: string, privacyLevel: PrivacyLevel): boolean;
```

### Event Bus

#### `createEventBus`

```typescript
function createEventBus(options?: { debug?: boolean }): EventBus;
```

### MCP Client

#### `ContextProvider`

```typescript
interface ContextProvider {
  initialize(): void;
  getContext(query: ContextQuery): Promise<QueryResult>;
  dispose(): void;
}
```

#### `McpOptions`

```typescript
interface McpOptions {
  privacyLevel?: 'strict' | 'balanced' | 'permissive';
  permissions?: string[];
  scope?: 'current-view' | 'full-page' | 'application';
  realTimeUpdates?: boolean;
  maxContextSize?: number;
  updateIntervalMs?: number;
}
```

#### `McpClient`

```typescript
class McpClient {
  constructor(options: McpOptions);
  initialize(provider: ContextProvider): void;
  updateOptions(options: Partial<McpOptions>): void;
  getContext(query?: Partial<ContextQuery>): Promise<QueryResult>;
  subscribe(eventType: string, handler: (event: any) => void): () => void;
  dispose(): void;
  actions: {
    highlight: (selector: string) => Promise<void>;
    navigate: (url: string) => Promise<void>;
    execute: (action: string, params: any) => Promise<any>;
  };
}
```

#### `createMcpClient`

```typescript
function createMcpClient(options: McpOptions): McpClient;
```

## Browser Package (`@mcp/browser`)

### `BrowserContextProviderOptions`

```typescript
interface BrowserContextProviderOptions {
  observeDomMutations?: boolean;
  trackUserInteractions?: boolean;
  trackNavigation?: boolean;
  updateIntervalMs?: number;
  maxDomDepth?: number;
}
```

### `BrowserContextProvider`

```typescript
class BrowserContextProvider {
  constructor(options?: BrowserContextProviderOptions);
  initialize(): void;
  getContext(query: ContextQuery): Promise<QueryResult>;
  dispose(): void;
}
```

### `createBrowserContextProvider`

```typescript
function createBrowserContextProvider(
  options?: BrowserContextProviderOptions
): BrowserContextProvider;
```

## Privacy Package (`@mcp/privacy`)

### `PrivacyFilterOptions`

```typescript
interface PrivacyFilterOptions {
  privacyLevel: PrivacyLevel;
  customPatterns?: Record<string, RegExp>;
  customSelectors?: string[];
  redactFormValues?: boolean;
  redactUrls?: boolean;
  redactCookies?: boolean;
}
```

### `PrivacyFilter`

```typescript
class PrivacyFilter {
  constructor(options: PrivacyFilterOptions);
  filterContext(context: any): any;
  containsPII(text: string): boolean;
  redactPII(text: string): string;
  isSensitiveElement(element: any): boolean;
}
```

### `createPrivacyFilter`

```typescript
function createPrivacyFilter(options: PrivacyFilterOptions): PrivacyFilter;
```

## Processing Package (`@mcp/processing`)

### `ContextProcessorOptions`

```typescript
interface ContextProcessorOptions {
  maxDomDepth?: number;
  includeTextContent?: boolean;
  includeStyles?: boolean;
  includeAccessibility?: boolean;
  includeBoundingRects?: boolean;
  maxInteractions?: number;
  includeComponents?: boolean;
}
```

### `ContextProcessor`

```typescript
class ContextProcessor {
  constructor(options?: ContextProcessorOptions);
  setPrivacyFilter(filter: PrivacyFilter): void;
  processContext(context: Context, query: ContextQuery): Context;
}
```

### `createContextProcessor`

```typescript
function createContextProcessor(options?: ContextProcessorOptions): ContextProcessor;
```

## Model Package (`@mcp/model`)

### `ModelClientOptions`

```typescript
interface ModelClientOptions {
  privacyLevel: PrivacyLevel;
  permissions: string[];
  scope: 'current-page' | 'all-pages' | 'domain';
  realTimeUpdates: boolean;
  maxContextSize?: number;
  updateIntervalMs?: number;
  apiBaseUrl?: string;
  apiKey?: string;
}
```

### `ModelActionOptions`

```typescript
interface ModelActionOptions {
  timeout?: number;
  waitForCompletion?: boolean;
}
```

### `ModelClient`

```typescript
class ModelClient {
  constructor(options: ModelClientOptions);
  initialize(provider: any): void;
  updateOptions(options: Partial<ModelClientOptions>): void;
  getContext(query: ContextQuery): Promise<QueryResult>;
  highlightElement(selector: string, options?: ModelActionOptions): Promise<boolean>;
  navigateTo(url: string, options?: ModelActionOptions): Promise<boolean>;
  executeAction(action: string, params: any, options?: ModelActionOptions): Promise<any>;
  dispose(): void;
}
```

### `createModelClient`

```typescript
function createModelClient(options: ModelClientOptions): ModelClient;
```
