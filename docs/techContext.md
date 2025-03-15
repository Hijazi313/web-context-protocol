# Model Context Protocol - Technical Context

This document provides technical context for the Model Context Protocol (MCP) project, including technologies used, development environment, and technical decisions.

## Technology Stack

### Core Technologies

- **TypeScript**: Primary programming language
- **JavaScript**: Target language for browser compatibility
- **HTML/CSS**: For example applications and documentation
- **JSON**: For configuration and data interchange

### Build Tools

- **Lerna**: Monorepo management
- **Rollup**: Module bundling for packages
- **Webpack**: Bundling for example applications and browser extension
- **TypeScript Compiler**: Static type checking and transpilation
- **ESLint**: Code quality and style enforcement
- **Prettier**: Code formatting
- **Jest**: Testing framework

### Development Environment

- **Node.js**: JavaScript runtime for development
- **npm**: Package management
- **Git**: Version control
- **GitHub**: Repository hosting and collaboration
- **VS Code**: Recommended editor with TypeScript support

### Browser APIs

- **DOM API**: For DOM context acquisition
- **MutationObserver**: For tracking DOM changes
- **IntersectionObserver**: For tracking element visibility
- **History API**: For tracking navigation
- **Storage API**: For persisting settings
- **Web Workers**: For performance-intensive operations

### Browser Extension APIs

- **WebExtension API**: Cross-browser extension development
- **Chrome Extension API**: Chrome-specific functionality
- **Firefox Add-on API**: Firefox-specific functionality
- **Content Scripts**: For injecting MCP into web pages
- **Background Scripts**: For managing extension state
- **Storage API**: For persisting extension settings
- **Message Passing API**: For communication between extension components
- **DevTools API**: For creating developer tools panels

## Package Structure

The MCP project is organized as a monorepo with the following packages:

### Core Packages

- **@mcp/core**: Core interfaces, types, and utilities
- **@mcp/browser**: Browser-specific context acquisition
- **@mcp/privacy**: Privacy filtering and PII protection
- **@mcp/processing**: Context processing and transformation
- **@mcp/model**: Model integration and action execution

### Extension Package

- **@mcp/extension**: Browser extension for MCP integration

### Example Applications

- **content-summarization**: Example of content summarization
- **ecommerce-recommendations**: Example of e-commerce recommendations
- **form-assistance**: Example of form assistance

## Development Workflow

### Setup

```bash
# Clone the repository
git clone https://github.com/example/mcp.git

# Install dependencies
cd mcp
npm install

# Bootstrap packages
npx lerna bootstrap
```

### Build

```bash
# Build all packages
npm run build

# Build specific package
npm run build --scope=@mcp/core

# Build in watch mode
npm run dev
```

### Test

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --scope=@mcp/core

# Run tests in watch mode
npm test -- --watch
```

### Lint

```bash
# Lint all packages
npm run lint

# Lint specific package
npm run lint --scope=@mcp/core

# Fix linting issues
npm run lint:fix
```

### Release

```bash
# Create a new release
npx lerna version

# Publish packages
npx lerna publish
```

## Browser Extension Development

### Setup

```bash
# Build the extension
npm run build:extension

# Build in watch mode
npm run build:extension:watch
```

### Loading in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `packages/extension/dist` directory

### Loading in Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select the `packages/extension/dist/manifest.json` file

### Extension Architecture

The browser extension is structured as follows:

1. **Background Script**: Manages state and coordinates between components

   - Handles extension lifecycle events
   - Manages global and site-specific settings
   - Coordinates communication between components

2. **Content Script**: Injects MCP into web pages

   - Injects the MCP library into web pages
   - Captures context from the page
   - Applies privacy filters
   - Communicates with the background script

3. **Popup UI**: Provides quick access to settings

   - Displays current site settings
   - Allows toggling MCP on/off
   - Provides privacy level selection
   - Shows basic context statistics

4. **Options Page**: Provides comprehensive configuration

   - Manages global settings
   - Configures site-specific settings
   - Provides advanced privacy controls
   - Offers debugging tools

5. **DevTools Panel**: Provides developer tools
   - Visualizes context data
   - Provides debugging information
   - Allows testing different privacy levels
   - Shows performance metrics

## Technical Decisions

### TypeScript

TypeScript was chosen for:

- **Type Safety**: Catch errors at compile time
- **Developer Experience**: Better tooling and IDE support
- **Documentation**: Self-documenting code through types
- **Maintainability**: Easier refactoring and code navigation

### Monorepo Structure

A monorepo structure was chosen for:

- **Simplified Dependency Management**: Shared dependencies
- **Atomic Changes**: Changes across packages in a single commit
- **Consistent Tooling**: Shared configuration and scripts
- **Simplified Testing**: Test across package boundaries

### Browser Extension

A browser extension was developed to:

- **Provide User Control**: Give users control over MCP settings
- **Enable Universal Integration**: Allow MCP to work on any website
- **Offer Developer Tools**: Provide tools for debugging and visualization
- **Enhance Privacy**: Give users granular privacy controls

### Privacy-First Design

Privacy is a core concern:

- **Configurable Privacy Levels**: Different levels for different needs
- **PII Detection and Redaction**: Automatic protection of sensitive information
- **User Control**: Users can control what information is shared
- **Transparency**: Clear indication of what information is being captured

### Performance Optimization

Performance is optimized through:

- **Throttling and Debouncing**: Limit the frequency of context updates
- **Selective Context Capture**: Only capture relevant context
- **DOM Tree Pruning**: Remove irrelevant parts of the DOM tree
- **Lazy Initialization**: Initialize components only when needed
- **Caching**: Cache context to avoid redundant processing

## Browser Compatibility

The MCP is designed to work with:

- **Chrome**: Version 80+
- **Firefox**: Version 78+
- **Edge**: Version 80+ (Chromium-based)
- **Safari**: Version 14+ (with limitations)

The browser extension currently supports:

- **Chrome**: Primary target platform
- **Firefox**: Support in progress
- **Edge**: Compatible with Chrome extension

## Security Considerations

Security measures include:

- **Content Security Policy**: Prevent XSS attacks
- **Secure Communication**: Use secure messaging between components
- **Permission Minimization**: Request only necessary permissions
- **Data Minimization**: Capture only necessary context
- **Isolation**: Isolate extension components from each other

## Performance Considerations

Performance optimizations include:

- **Throttled Context Updates**: Limit update frequency
- **Selective DOM Traversal**: Only traverse relevant parts of the DOM
- **Efficient Data Structures**: Use efficient data structures for context
- **Lazy Loading**: Load components only when needed
- **Background Processing**: Process context in background threads when possible

## Future Technical Directions

Planned technical enhancements:

- **WebAssembly**: For performance-intensive operations
- **Service Workers**: For offline support and caching
- **Server-Side Rendering Support**: For SSR applications
- **Framework-Specific Integrations**: For React, Vue, Angular, etc.
- **Mobile Browser Support**: For mobile web applications
- **Context Compression**: For efficient context transmission
- **Machine Learning**: For intelligent context filtering and prioritization
