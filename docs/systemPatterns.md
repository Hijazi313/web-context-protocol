# Model Context Protocol - System Patterns

This document outlines the architectural patterns and design decisions used in the Model Context Protocol (MCP) project.

## Architectural Patterns

### Layered Architecture

The MCP follows a layered architecture with clear separation of concerns:

1. **Context Acquisition Layer** (Browser Package): Responsible for capturing raw context from the web application.
2. **Privacy Filtering Layer** (Privacy Package): Handles sensitive information and applies privacy rules.
3. **Context Processing Layer** (Processing Package): Transforms raw context into structured, relevant information.
4. **Model Integration Layer** (Model Package): Enables AI models to consume context and perform actions.

This layered approach allows for:

- Clear separation of concerns
- Independent development and testing of each layer
- Flexibility to replace or extend individual layers
- Progressive enhancement of functionality

### Provider Pattern

The MCP uses the Provider Pattern to abstract the source of context:

```typescript
interface ContextProvider {
  initialize(): void;
  getContext(query: ContextQuery): Promise<QueryResult>;
  dispose(): void;
}
```

This pattern allows:

- Multiple implementations of context providers (browser, server, custom)
- Easy testing through mock providers
- Decoupling of context acquisition from context consumption

### Factory Pattern

Factory functions are used to create instances of complex objects:

```typescript
function createMcpClient(options: McpOptions): McpClient {
  return new McpClient(options);
}

function createBrowserContextProvider(options: BrowserProviderOptions): ContextProvider {
  return new BrowserContextProvider(options);
}
```

Benefits include:

- Simplified object creation
- Encapsulation of implementation details
- Consistent initialization of objects
- Easier testing through dependency injection

### Observer Pattern

The event system implements the Observer Pattern:

```typescript
interface EventBus {
  subscribe(eventType: string, handler: EventHandler): Unsubscribe;
  emit(event: Event): void;
  clear(): void;
}
```

This enables:

- Loose coupling between components
- Real-time notifications of state changes
- Extensibility through custom event handlers
- Simplified communication between layers

### Strategy Pattern

The privacy filtering uses the Strategy Pattern:

```typescript
interface PrivacyStrategy {
  apply(context: Context): Context;
}

class StrictPrivacyStrategy implements PrivacyStrategy {
  apply(context: Context): Context {
    // Apply strict privacy rules
  }
}
```

This allows:

- Different privacy strategies based on privacy level
- Runtime switching between strategies
- Extensibility through custom strategies
- Encapsulation of privacy rules

## Design Decisions

### Monorepo Structure

The decision to use a monorepo structure with Lerna provides:

- Centralized management of dependencies
- Simplified versioning and publishing
- Shared configuration and tooling
- Easier cross-package development and testing

### TypeScript

TypeScript was chosen for:

- Strong typing and interface definitions
- Better developer experience with IDE support
- Early error detection
- Self-documenting code
- Improved maintainability

### Privacy-First Approach

Privacy is a core concern, not an afterthought:

- Multiple privacy levels (Strict, Balanced, Permissive)
- PII detection and redaction
- Configurable privacy rules
- Transparent privacy handling

### Performance Considerations

Performance optimizations include:

- Throttling and debouncing of context updates
- Selective context capture
- DOM tree pruning
- Configurable update intervals
- Lazy initialization of components

### Extensibility

The MCP is designed to be extensible:

- Interface-based design
- Plugin architecture for custom implementations
- Event system for communication
- Configuration options for customization
- Factory functions for dependency injection

## Code Organization

### Package Structure

Each package follows a consistent structure:

- `src/index.ts`: Main entry point and public API
- `src/types.ts`: Type definitions and interfaces
- `src/utils.ts`: Utility functions
- `src/__tests__/`: Test files
- `rollup.config.js`: Build configuration
- `package.json`: Package metadata and dependencies

### Naming Conventions

- **Interfaces**: PascalCase, descriptive of the contract (e.g., `ContextProvider`)
- **Classes**: PascalCase, implementation of interfaces (e.g., `BrowserContextProvider`)
- **Functions**: camelCase, descriptive of the action (e.g., `createMcpClient`)
- **Constants**: UPPER_SNAKE_CASE for true constants, PascalCase for enums
- **Private members**: Prefixed with underscore (e.g., `_eventBus`)

### Error Handling

- Promise-based API with consistent error handling
- Result objects with success/error information
- Error events for asynchronous error reporting
- Graceful degradation when features are unavailable

## Future Architectural Considerations

- **Microservices**: For server-side components
- **WebWorkers**: For performance-intensive operations
- **WebAssembly**: For computationally expensive tasks
- **Service Worker**: For offline support and caching
- **Federated Architecture**: For distributed context processing
