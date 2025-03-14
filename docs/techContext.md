# Model Context Protocol - Technical Context

This document outlines the technical context of the Model Context Protocol (MCP) project, including technologies used, dependencies, and development environment.

## Technologies

### Core Technologies

- **TypeScript**: The primary language used for development, providing static typing and modern JavaScript features.
- **JavaScript (ES2020+)**: The target language for browser compatibility.
- **Node.js**: The runtime environment for development and building.
- **npm/Yarn**: Package managers for dependency management.

### Build Tools

- **Lerna**: Monorepo management tool for versioning and publishing.
- **Rollup**: Module bundler for creating optimized distribution bundles.
- **TypeScript Compiler**: For type checking and transpilation.
- **Babel**: For additional transpilation features when needed.
- **ESLint**: For code quality and style enforcement.
- **Prettier**: For consistent code formatting.

### Testing Tools

- **Jest**: Testing framework for unit and integration tests.
- **Testing Library**: For DOM testing utilities.
- **ts-jest**: TypeScript preprocessor for Jest.
- **Sinon**: For mocks, stubs, and spies in tests.

### Development Tools

- **Visual Studio Code**: Recommended IDE with TypeScript integration.
- **Chrome DevTools**: For debugging and performance profiling.
- **npm Scripts**: For common development tasks.
- **Husky**: For Git hooks to enforce quality checks.
- **lint-staged**: For running linters on staged files.

## Dependencies

### Production Dependencies

#### Core Package

- **typescript**: TypeScript language support
- **tslib**: Runtime library for TypeScript helpers

#### Browser Package

- **@mcp/core**: Core interfaces and utilities
- **mutation-observer**: Polyfill for MutationObserver API
- **resize-observer-polyfill**: Polyfill for ResizeObserver API

#### Privacy Package

- **@mcp/core**: Core interfaces and utilities
- **pii-filter**: Library for PII detection and redaction

#### Processing Package

- **@mcp/core**: Core interfaces and utilities
- **@mcp/privacy**: Privacy filtering utilities

#### Model Package

- **@mcp/core**: Core interfaces and utilities
- **@mcp/processing**: Context processing utilities

### Development Dependencies

- **@rollup/plugin-typescript**: TypeScript support for Rollup
- **@rollup/plugin-node-resolve**: Node.js module resolution for Rollup
- **@rollup/plugin-commonjs**: CommonJS module support for Rollup
- **rollup-plugin-terser**: Minification for Rollup bundles
- **@types/jest**: TypeScript definitions for Jest
- **jest**: Testing framework
- **ts-jest**: TypeScript support for Jest
- **eslint**: Linting utility
- **@typescript-eslint/eslint-plugin**: TypeScript rules for ESLint
- **@typescript-eslint/parser**: TypeScript parser for ESLint
- **prettier**: Code formatting
- **eslint-config-prettier**: ESLint configuration for Prettier
- **eslint-plugin-prettier**: ESLint plugin for Prettier
- **husky**: Git hooks
- **lint-staged**: Run linters on staged files

## Development Environment

### Requirements

- Node.js v14.0.0 or higher
- npm v6.0.0 or higher or Yarn v1.22.0 or higher
- Git

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

### Development Workflow

1. **Setup**: Clone the repository and install dependencies.
2. **Branch**: Create a feature branch for your work.
3. **Develop**: Make changes to the codebase.
4. **Test**: Run tests to ensure your changes work as expected.
5. **Lint**: Run linters to ensure code quality.
6. **Build**: Build the packages to ensure they compile correctly.
7. **Commit**: Commit your changes with a descriptive message.
8. **Push**: Push your changes to the remote repository.
9. **PR**: Create a pull request for review.

### Common Commands

```bash
# Install dependencies
npm install

# Bootstrap the monorepo
npx lerna bootstrap

# Build all packages
npm run build

# Build a specific package
npx lerna run build --scope=@mcp/core

# Run tests
npm test

# Run tests for a specific package
npx lerna run test --scope=@mcp/core

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Clean build artifacts
npm run clean

# Publish packages (for maintainers)
npx lerna publish
```

## Browser Compatibility

The MCP is designed to work with modern browsers:

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

Polyfills are included for:

- MutationObserver
- ResizeObserver
- Promise
- fetch
- Object.assign
- Array.from

## Performance Considerations

- **Bundle Size**: The packages are designed to be tree-shakable to minimize bundle size.
- **Runtime Performance**: Performance-critical operations are optimized.
- **Memory Usage**: Care is taken to avoid memory leaks and excessive memory usage.
- **Network Usage**: Context updates are throttled to minimize network usage.

## Security Considerations

- **Content Security Policy (CSP)**: The MCP is designed to work with strict CSP.
- **Cross-Origin Resource Sharing (CORS)**: The MCP respects CORS restrictions.
- **Privacy**: PII is handled according to privacy best practices.
- **Permissions**: The MCP uses a permission system to control access to features.

## Deployment

The packages are published to npm with the `@mcp` scope:

```bash
# Install from npm
npm install @mcp/core @mcp/browser
```

CDN links are also available:

```html
<!-- UMD build -->
<script src="https://unpkg.com/@mcp/core@latest/dist/core.umd.js"></script>
<script src="https://unpkg.com/@mcp/browser@latest/dist/browser.umd.js"></script>

<!-- ES Module build -->
<script type="module">
  import { createMcpClient } from 'https://unpkg.com/@mcp/core@latest/dist/core.esm.js';
  import { createBrowserContextProvider } from 'https://unpkg.com/@mcp/browser@latest/dist/browser.esm.js';
</script>
```
