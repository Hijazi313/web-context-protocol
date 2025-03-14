# Model Context Protocol - Project Structure

This document outlines the structure of the Model Context Protocol (MCP) project, explaining the purpose of each package and how they interact with each other.

## Monorepo Structure

The MCP project is organized as a monorepo using Lerna, with the following packages:

```
mcp/
├── packages/
│   ├── core/           # Core interfaces and utilities
│   ├── browser/        # Browser-specific implementation
│   ├── privacy/        # Privacy filtering and PII detection
│   ├── processing/     # Context processing and transformation
│   └── model/          # Model integration and API
├── docs/               # Documentation
├── examples/           # Example applications
└── scripts/            # Build and development scripts
```

## Package Descriptions

### Core Package (`@mcp/core`)

The core package provides the fundamental interfaces, types, and utilities used throughout the MCP architecture. It includes:

- Context interfaces defining the data structures for DOM, user, and application context
- Event system interfaces and implementation
- Utility functions for throttling, debouncing, and privacy

**Key Files:**

- `src/interfaces/context.ts`: Core data structures for the context model
- `src/interfaces/events.ts`: Event system interfaces
- `src/events/event-bus.ts`: Event bus implementation
- `src/utils/`: Utility functions

### Browser Package (`@mcp/browser`)

The browser package provides browser-specific implementations for context acquisition, DOM observation, and user interaction tracking. It includes:

- DOM mutation observer
- User interaction tracking
- Navigation tracking
- Context acquisition from the browser environment

**Key Files:**

- `src/index.ts`: Browser context provider implementation

### Privacy Package (`@mcp/privacy`)

The privacy package provides privacy filtering, PII detection, and permission management. It includes:

- PII detection and redaction
- Sensitive element detection
- Privacy level management
- Context filtering based on privacy settings

**Key Files:**

- `src/index.ts`: Privacy filter implementation

### Processing Package (`@mcp/processing`)

The processing package provides context processing, transformation, and relevance filtering. It includes:

- DOM tree pruning and transformation
- Interaction filtering
- Component tree processing
- Context optimization

**Key Files:**

- `src/index.ts`: Context processor implementation

### Model Package (`@mcp/model`)

The model package provides model integration and API for interacting with AI models. It includes:

- Context querying
- Action execution
- Model client implementation
- API integration

**Key Files:**

- `src/index.ts`: Model client implementation

## Dependencies

The packages have the following dependencies:

- `@mcp/core`: No dependencies
- `@mcp/browser`: Depends on `@mcp/core`
- `@mcp/privacy`: Depends on `@mcp/core`
- `@mcp/processing`: Depends on `@mcp/core` and `@mcp/privacy`
- `@mcp/model`: Depends on `@mcp/core`, `@mcp/privacy`, and `@mcp/processing`

## Build System

The project uses the following build tools:

- **TypeScript**: For type checking and transpilation
- **Rollup**: For bundling
- **Jest**: For testing
- **ESLint**: For linting
- **Prettier**: For code formatting

Each package has its own `tsconfig.json`, `package.json`, and `rollup.config.js` files for package-specific configuration.

## Development Workflow

1. Install dependencies: `npm install`
2. Bootstrap the monorepo: `npm run bootstrap`
3. Build all packages: `npm run build`
4. Run tests: `npm test`
5. Run linting: `npm run lint`

## Package Publishing

Packages are published to npm with the `@mcp` scope. The publishing process is managed by Lerna, which handles versioning and publishing of packages.
