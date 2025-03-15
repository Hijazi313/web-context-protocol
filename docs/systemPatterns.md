# Model Context Protocol - System Patterns

This document outlines the key architectural and design patterns used throughout the Model Context Protocol (MCP) project. These patterns ensure consistency, maintainability, and scalability across the codebase.

## Architectural Patterns

### Modular Monolith

The MCP project is structured as a modular monolith using Lerna for package management. This approach provides:

- **Clear Boundaries**: Each package has a well-defined responsibility
- **Independent Versioning**: Packages can be versioned independently
- **Shared Code**: Common utilities and interfaces are easily shared
- **Simplified Development**: Single repository for easier development workflow

### Layered Architecture

The codebase follows a layered architecture pattern:

1. **Core Layer**: Fundamental interfaces, types, and utilities
2. **Provider Layer**: Context acquisition from different sources
3. **Processing Layer**: Context transformation and filtering
4. **Privacy Layer**: PII detection and redaction
5. **Integration Layer**: Integration with models and applications

### Event-Driven Architecture

MCP uses an event-driven architecture for handling context changes:

- **Event Emitters**: Components emit events when context changes
- **Event Listeners**: Components listen for events to update their state
- **Event Bus**: Central event bus for communication between components

### Browser Extension Architecture

The browser extension follows a multi-process architecture:

1. **Background Process**: Long-running state management and coordination
2. **Content Process**: Page-specific context acquisition and processing
3. **UI Process**: User interface for configuration and visualization
4. **DevTools Process**: Developer tools for debugging and inspection

## Design Patterns

### Factory Pattern

Factory patterns are used for creating complex objects:

- **Context Factory**: Creates context objects from different sources
- **Provider Factory**: Creates appropriate providers based on environment
- **Privacy Filter Factory**: Creates privacy filters based on privacy level
- **Visualizer Factory**: Creates appropriate visualizers for different context types

### Strategy Pattern

Strategy patterns are used for interchangeable algorithms:

- **Privacy Strategy**: Different strategies for different privacy levels
- **Processing Strategy**: Different strategies for processing different types of context
- **Acquisition Strategy**: Different strategies for acquiring context from different sources
- **Storage Strategy**: Different strategies for storing settings in the browser extension

### Observer Pattern

Observer patterns are used for maintaining consistency:

- **Context Observer**: Observes changes in the DOM and updates context
- **User Interaction Observer**: Observes user interactions and updates context
- **Navigation Observer**: Observes navigation events and updates context
- **Settings Observer**: Observes changes in extension settings and updates behavior

### Adapter Pattern

Adapter patterns are used for compatibility:

- **Framework Adapters**: Adapt framework-specific APIs to MCP interfaces
- **Model Adapters**: Adapt MCP context to model-specific formats
- **Browser API Adapters**: Adapt browser-specific APIs to cross-browser interfaces
- **Storage Adapters**: Adapt different storage mechanisms to a common interface

### Decorator Pattern

Decorator patterns are used for extending functionality:

- **Privacy Decorator**: Adds privacy filtering to context providers
- **Caching Decorator**: Adds caching to context providers
- **Logging Decorator**: Adds logging to context providers
- **Performance Monitoring Decorator**: Adds performance monitoring to components

### Singleton Pattern

Singleton patterns are used for shared resources:

- **Configuration Manager**: Manages global configuration
- **Event Bus**: Provides a central event bus
- **Extension State Manager**: Manages global extension state
- **Logger**: Provides a centralized logging service

### Command Pattern

Command patterns are used for encapsulating operations:

- **Context Update Command**: Encapsulates context update operations
- **Privacy Filter Command**: Encapsulates privacy filtering operations
- **Settings Change Command**: Encapsulates settings change operations
- **Context Visualization Command**: Encapsulates context visualization operations

## Code Organization Patterns

### Feature-Based Organization

Code is organized by feature rather than by type:

- **Context Acquisition**: All code related to acquiring context
- **Privacy Filtering**: All code related to privacy filtering
- **Context Processing**: All code related to processing context
- **User Interface**: All code related to user interfaces

### Interface-First Development

Interfaces are defined before implementations:

- **Clear Contracts**: Interfaces define clear contracts between components
- **Multiple Implementations**: Interfaces allow for multiple implementations
- **Testability**: Interfaces facilitate mocking for testing
- **Documentation**: Interfaces serve as documentation

### Dependency Injection

Dependencies are injected rather than created internally:

- **Testability**: Dependencies can be mocked for testing
- **Flexibility**: Dependencies can be swapped at runtime
- **Decoupling**: Components are decoupled from their dependencies
- **Configuration**: Dependencies can be configured externally

### Progressive Enhancement

Features are implemented with progressive enhancement:

- **Core Functionality**: Basic functionality works without advanced features
- **Optional Enhancements**: Advanced features are added progressively
- **Graceful Degradation**: System degrades gracefully when features are unavailable
- **Feature Detection**: System detects available features and adapts accordingly

## Browser Extension Patterns

### Message Passing

Communication between extension components uses message passing:

- **Background-Content Communication**: Messages between background and content scripts
- **UI-Background Communication**: Messages between UI and background scripts
- **Content-Page Communication**: Messages between content scripts and web pages
- **DevTools-Content Communication**: Messages between DevTools and content scripts

### State Management

The extension uses a centralized state management approach:

- **Single Source of Truth**: Background script maintains the source of truth
- **State Synchronization**: State is synchronized between components
- **Persistent Storage**: State is persisted in browser storage
- **Change Notifications**: Components are notified of state changes

### Content Script Injection

Content scripts are injected strategically:

- **Conditional Injection**: Scripts are only injected when needed
- **Progressive Injection**: Core functionality is injected first, followed by enhancements
- **Isolated Injection**: Scripts are isolated from the page's JavaScript
- **Dynamic Injection**: Scripts can be injected dynamically based on conditions

### User Interface Patterns

The extension UI follows consistent patterns:

- **Popup for Quick Access**: Popup provides quick access to common settings
- **Options Page for Advanced Settings**: Options page provides access to advanced settings
- **Inline Controls**: Controls are provided inline where appropriate
- **Consistent Visual Language**: Consistent icons, colors, and terminology

## Testing Patterns

### Unit Testing

Unit tests focus on testing individual components:

- **Component Isolation**: Components are tested in isolation
- **Dependency Mocking**: Dependencies are mocked for testing
- **Behavior Verification**: Tests verify component behavior
- **Edge Case Coverage**: Tests cover edge cases and error conditions

### Integration Testing

Integration tests focus on testing component interactions:

- **Component Composition**: Tests verify that components work together
- **API Contracts**: Tests verify that APIs work as expected
- **Cross-Package Integration**: Tests verify integration between packages
- **Browser Integration**: Tests verify integration with browser APIs

### End-to-End Testing

End-to-end tests focus on testing the entire system:

- **User Scenarios**: Tests simulate real user scenarios
- **Browser Automation**: Tests use browser automation
- **Visual Verification**: Tests verify visual appearance
- **Performance Verification**: Tests verify performance characteristics

## Documentation Patterns

### Code Documentation

Code is documented using consistent patterns:

- **Interface Documentation**: Interfaces are thoroughly documented
- **Function Documentation**: Functions are documented with parameters and return values
- **Example Usage**: Examples are provided for complex functionality
- **Implementation Notes**: Important implementation details are documented

### User Documentation

User documentation follows consistent patterns:

- **Getting Started**: Quick start guides for new users
- **Conceptual Documentation**: Explanation of key concepts
- **API Reference**: Detailed API documentation
- **Examples**: Example applications and use cases
- **Troubleshooting**: Common issues and solutions

## Conclusion

These patterns provide a consistent approach to development across the MCP project. By following these patterns, we ensure that the codebase remains maintainable, scalable, and consistent as it grows.

# System Patterns and Conventions

## Commit Message Format

We follow a structured commit message format to maintain consistency and clarity in our version control history.

### Basic Structure

```
<type>(<scope>): <short summary>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Rules and Guidelines

1. **Summary Line (First Line)**

   - Maximum 50 characters
   - Format: `<type>(<scope>): <short summary>`
   - No period at the end

2. **Commit Types**

   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, etc.)
   - `refactor`: Code refactoring
   - `test`: Adding/updating tests
   - `chore`: Maintenance tasks
   - `build`: Build system changes
   - `perf`: Performance improvements
   - `ci`: CI/CD changes

3. **Scopes**

   - `auth`: Authentication/authorization
   - `users`: User management
   - `database`: Database changes
   - `config`: Configuration
   - `services`: Service layer
   - `controllers`: Controller layer
   - `middleware`: Middleware
   - `scripts`: Development scripts
   - `tests`: Testing
   - `docs`: Documentation

4. **Body**

   - Wrap at 72 characters
   - Use bullet points with:
     - What: Changes made
     - Why: Reason for changes
     - How: Implementation details
     - Notes: Additional context

5. **Footer**
   - Include `BREAKING CHANGE:` if applicable
   - Reference issues/PRs (e.g., `Closes #123`)
   - Include migration steps if needed

### Example Commit Message

```
feat(auth): add JWT-based authentication

- What: Added login, registration, and JWT token generation functionality
- Why: To enable secure user authentication for the platform
- How: Integrated Passport.js with AuthModule, added strategies for
  local and JWT authentication, and created guards for route protection
- Notes: Tested with Postman, added unit tests for AuthService

BREAKING CHANGE: Updated the database schema for the User table
- Migration steps: Run `npm run migrate` to apply changes
Closes #123, Fixes #456
```
