# Model Context Protocol - Usage Guide

This document provides a guide on how to use the Model Context Protocol (MCP) in your applications.

## Installation

To use MCP in your project, you need to install the required packages:

```bash
# Install all packages
npm install @mcp/core @mcp/browser @mcp/privacy @mcp/processing @mcp/model

# Or install individual packages as needed
npm install @mcp/core @mcp/browser
```

## Basic Usage

### Creating a Model Client

The main entry point for using MCP is the `McpClient` class from the `@mcp/core` package:

```typescript
import { createMcpClient, PrivacyLevel } from '@mcp/core';
import { createBrowserContextProvider } from '@mcp/browser';

// Create a browser context provider
const provider = createBrowserContextProvider({
  observeDomMutations: true,
  trackUserInteractions: true,
  trackNavigation: true,
  updateIntervalMs: 1000,
  maxDomDepth: 10,
});

// Create a model client
const client = createMcpClient({
  privacyLevel: PrivacyLevel.BALANCED,
  permissions: ['dom.read', 'user.interaction'],
  scope: 'current-view',
  realTimeUpdates: true,
  maxContextSize: 1024 * 1024, // 1MB
  updateIntervalMs: 1000,
});

// Initialize the client with the provider
client.initialize(provider);
```

### Getting Context

Once you have created and initialized a client, you can get context from the current page:

```typescript
// Get full context
client.getContext().then(result => {
  if (result.success) {
    console.log('Context:', result.context);
    console.log('Execution time:', result.executionTime, 'ms');
  } else {
    console.error('Error getting context:', result.error);
  }
});

// Get specific parts of the context
client
  .getContext({
    includeDOM: true,
    includeUserContext: false,
    includeAppContext: false,
    selector: '#main-content',
    maxDepth: 3,
  })
  .then(result => {
    if (result.success) {
      console.log('DOM context:', result.context.dom);
    }
  });
```

### Performing Actions

The client provides actions for interacting with the page:

```typescript
// Highlight an element
client.actions.highlight('#submit-button').then(() => {
  console.log('Element highlighted');
});

// Navigate to a URL
client.actions.navigate('https://example.com').then(() => {
  console.log('Navigated to URL');
});

// Execute a custom action
client.actions.execute('click', { selector: '#submit-button' }).then(result => {
  console.log('Action executed:', result);
});
```

### Updating Options

You can update the client options at any time:

```typescript
client.updateOptions({
  privacyLevel: PrivacyLevel.STRICT,
  realTimeUpdates: false,
});
```

### Subscribing to Events

You can subscribe to events emitted by the client:

```typescript
// Subscribe to context updates
const unsubscribe = client.subscribe('context:update', event => {
  console.log('Context updated:', event.data);
});

// Later, unsubscribe when no longer needed
unsubscribe();
```

### Disposing the Client

When you're done with the client, you should dispose of it to clean up resources:

```typescript
client.dispose();
```

## Advanced Usage

### Creating Custom Context Providers

You can create custom context providers by implementing the `ContextProvider` interface:

```typescript
import { ContextProvider, ContextQuery, QueryResult } from '@mcp/core';

class CustomContextProvider implements ContextProvider {
  initialize(): void {
    // Initialize the provider
  }

  async getContext(query: ContextQuery): Promise<QueryResult> {
    // Get context based on the query
    return {
      context: {
        meta: {
          timestamp: Date.now(),
          source: 'custom',
          version: '1.0.0',
          privacyLevel: query.privacyLevel || 'balanced',
          url: 'https://example.com',
          domain: 'example.com',
        },
        dom: {
          // Custom DOM context
        },
        user: {
          // Custom user context
        },
        app: {
          // Custom app context
        },
      },
      executionTime: 0,
      success: true,
    };
  }

  dispose(): void {
    // Clean up resources
  }
}

// Use the custom provider
const provider = new CustomContextProvider();
client.initialize(provider);
```

### Creating Custom Privacy Filters

You can create custom privacy filters by extending the `PrivacyFilter` class:

```typescript
import { PrivacyFilter, PrivacyFilterOptions } from '@mcp/privacy';

class CustomPrivacyFilter extends PrivacyFilter {
  constructor(options: PrivacyFilterOptions) {
    super(options);
  }

  // Override methods as needed
  containsPII(text: string): boolean {
    // Custom PII detection logic
    return super.containsPII(text) || this.customPIIDetection(text);
  }

  private customPIIDetection(text: string): boolean {
    // Custom PII detection logic
    return false;
  }
}

// Use the custom filter
import { createContextProcessor } from '@mcp/processing';
import { createModelClient } from '@mcp/model';

const filter = new CustomPrivacyFilter({
  privacyLevel: 'balanced',
  customPatterns: {
    CUSTOM_PII: /custom-pattern/g,
  },
});

const processor = createContextProcessor();
processor.setPrivacyFilter(filter);

// Use the processor with a model client
// ...
```

### Creating Custom Context Processors

You can create custom context processors by extending the `ContextProcessor` class:

```typescript
import { ContextProcessor, ContextProcessorOptions } from '@mcp/processing';
import { Context, ContextQuery } from '@mcp/core';

class CustomContextProcessor extends ContextProcessor {
  constructor(options?: ContextProcessorOptions) {
    super(options);
  }

  // Override methods as needed
  processContext(context: Context, query: ContextQuery): Context {
    // Process context with custom logic
    const processedContext = super.processContext(context, query);

    // Apply custom transformations

    return processedContext;
  }
}

// Use the custom processor
const processor = new CustomContextProcessor({
  maxDomDepth: 5,
  includeTextContent: true,
});

// Use the processor with a model client
// ...
```

## Privacy Levels

MCP supports three privacy levels:

### Strict

The strict privacy level provides the highest level of privacy protection:

- Minimal data collection
- Aggressive PII filtering
- No form data collection
- No user interaction tracking
- Limited DOM structure

```typescript
import { PrivacyLevel } from '@mcp/core';

client.updateOptions({
  privacyLevel: PrivacyLevel.STRICT,
});
```

### Balanced

The balanced privacy level provides a moderate level of privacy protection:

- Moderate data collection
- PII filtering
- No form data collection
- User interaction tracking
- Full DOM structure

```typescript
import { PrivacyLevel } from '@mcp/core';

client.updateOptions({
  privacyLevel: PrivacyLevel.BALANCED,
});
```

### Permissive

The permissive privacy level provides the lowest level of privacy protection:

- Maximum data collection
- Basic PII filtering
- Form data collection
- User interaction tracking
- Full DOM structure

```typescript
import { PrivacyLevel } from '@mcp/core';

client.updateOptions({
  privacyLevel: PrivacyLevel.PERMISSIVE,
});
```

## Event System

MCP uses an event system to communicate between components. You can subscribe to events using the `subscribe` method:

```typescript
import { createEventBus } from '@mcp/core';

const eventBus = createEventBus({ debug: true });

// Subscribe to an event
const unsubscribe = eventBus.subscribe('context:update', event => {
  console.log('Context updated:', event.data);
});

// Emit an event
eventBus.emit({
  type: 'context:update',
  timestamp: Date.now(),
  contextType: 'dom',
  data: {
    /* context data */
  },
});

// Unsubscribe when no longer needed
unsubscribe();

// Clear all subscriptions
eventBus.clear();
```

## Error Handling

When retrieving context, you should always check the `success` property of the result:

```typescript
client.getContext().then(result => {
  if (result.success) {
    // Use the context
    console.log('Context:', result.context);
  } else {
    // Handle the error
    console.error('Error getting context:', result.error);
  }
});
```

You can also subscribe to error events:

```typescript
client.subscribe('error', event => {
  console.error('Error:', event.message);
});
```

## Performance Considerations

To optimize performance when using MCP:

1. **Limit the depth of the DOM tree**: Use the `maxDepth` option to limit the depth of the DOM tree captured.
2. **Limit the parts of the context**: Use the `includeDOM`, `includeUserContext`, and `includeAppContext` options to limit the parts of the context captured.
3. **Use selectors**: Use the `selector` option to limit the DOM context to specific elements.
4. **Throttle context updates**: Use the `updateIntervalMs` option to control the frequency of context updates.
5. **Dispose of the client when not needed**: Call the `dispose` method to clean up resources when the client is no longer needed.

## Browser Compatibility

MCP is designed to work with modern browsers, including:

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

Some features may not be available in older browsers or may require polyfills.
