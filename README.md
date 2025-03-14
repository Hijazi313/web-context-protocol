# Model Context Protocol (MCP)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/@mcp/core.svg)](https://www.npmjs.com/package/@mcp/core)

The Model Context Protocol (MCP) is a standardized framework for capturing, processing, and providing web context to AI models. It enables AI assistants to understand web page structure, user interactions, and application state while respecting privacy constraints.

## Features

- **Comprehensive Context Capture**: Collects DOM structure, user interactions, viewport information, and application state.
- **Privacy-First Design**: Multiple privacy levels with PII detection and redaction.
- **Modular Architecture**: Separate packages for core functionality, browser integration, privacy filtering, context processing, and model integration.
- **Extensible**: Custom implementations for context providers, privacy filters, and processors.
- **Performance Optimized**: Throttling, debouncing, and selective context capture to minimize overhead.
- **Framework Agnostic**: Works with any JavaScript framework or vanilla JS.

## Packages

The MCP is organized as a monorepo with the following packages:

- **[@mcp/core](./packages/core)**: Core interfaces, types, utilities, and the main client implementation.
- **[@mcp/browser](./packages/browser)**: Browser-specific context provider implementation.
- **[@mcp/privacy](./packages/privacy)**: Privacy filtering and PII detection.
- **[@mcp/processing](./packages/processing)**: Context processing and transformation.
- **[@mcp/model](./packages/model)**: Model integration and API.

## Example Applications

We've created several example applications to demonstrate how MCP can be used in real-world scenarios:

- **[Content Summarization](./examples/content-summarization)**: Demonstrates how MCP can be used to provide context-aware content summarization for articles and blog posts.
- **[E-commerce Recommendations](./examples/ecommerce-recommendations)**: Shows how MCP can track user interactions with products to provide personalized recommendations.
- **[Form Assistance](./examples/form-assistance)**: Illustrates how MCP can provide intelligent form field assistance, validation, and suggestions.

Each example includes:

- Complete source code with TypeScript
- Detailed documentation
- Implementation analysis
- Privacy controls demonstration

## Installation

You can install all packages at once:

```bash
npm install @mcp/core @mcp/browser @mcp/privacy @mcp/processing @mcp/model
```

Or install individual packages as needed:

```bash
npm install @mcp/core @mcp/browser
```

## Quick Start

```typescript
import { createMcpClient, PrivacyLevel } from '@mcp/core';
import { createBrowserContextProvider } from '@mcp/browser';

// Create a browser context provider
const provider = createBrowserContextProvider({
  observeDomMutations: true,
  trackUserInteractions: true,
  trackNavigation: true,
  maxDomDepth: 10,
});

// Create an MCP client
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

// Get context
client
  .getContext({
    includeDOM: true,
    includeUserContext: true,
    maxDepth: 5,
  })
  .then(result => {
    if (result.success) {
      console.log('Context:', result.context);
      console.log('Execution time:', result.executionTime, 'ms');
    } else {
      console.error('Error:', result.error);
    }
  });

// Subscribe to context updates
const unsubscribe = client.subscribe('context:update', event => {
  console.log('Context updated:', event.data);
});

// Clean up when done
function cleanup() {
  unsubscribe();
  client.dispose();
}
```

## Documentation

- [Project Structure](./docs/project-structure.md)
- [Architecture](./docs/architecture.md)
- [Usage Guide](./docs/usage-guide.md)
- [API Reference](./docs/api-reference.md)
- [System Patterns](./docs/systemPatterns.md)
- [Technical Context](./docs/techContext.md)
- [Project Brief](./docs/projectBrief.md)
- [Progress](./docs/progress.md)
- [Product Context](./docs/productContext.md)

## Use Cases

MCP can be used in a variety of scenarios:

1. **Content Summarization**: Provide AI with context about the content structure and user's reading patterns to generate better summaries.
2. **E-commerce Recommendations**: Track product interactions to provide personalized product recommendations.
3. **Form Assistance**: Help users fill out forms with intelligent suggestions and validation.
4. **Code Assistance**: Provide context about code structure and developer interactions for better code suggestions.
5. **Customer Support**: Give AI assistants context about user's journey and current page to provide better support.

## Privacy Levels

MCP supports three privacy levels:

- **Strict**: Minimal data collection, aggressive PII filtering
- **Balanced**: Moderate data collection with PII filtering
- **Permissive**: Maximum context with basic PII filtering

## Development

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp.git
cd mcp

# Install dependencies
npm install

# Bootstrap the monorepo
npx lerna bootstrap

# Build all packages
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run tests for a specific package
npm test -- --scope=@mcp/core
```

### Linting

```bash
# Lint all packages
npm run lint

# Fix linting issues
npm run lint:fix
```

## Contributing

Contributions are welcome! Please see our [Contributing Guide](./CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgements

- This project was inspired by the need for better context-aware AI assistants.
- Thanks to all contributors who have helped shape this project.
