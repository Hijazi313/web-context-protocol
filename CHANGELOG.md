# Changelog

All notable changes to the Model Context Protocol (MCP) project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project structure with monorepo setup using Lerna
- Core package with interfaces, types, and utilities
- Browser package with DOM, user, and app context implementations
- Privacy package with PII detection and redaction
- Processing package for context transformation
- Model package for AI model integration
- Comprehensive documentation including architecture, API reference, and usage guide
- Rollup configuration for all packages
- Event system for communication between components
- Privacy levels (Strict, Balanced, Permissive)

### Changed

- Moved the main client implementation from `@mcp/model` to `@mcp/core` as `McpClient`
- Renamed `NavigationEvent` to `NavigationChangeEvent` in events.ts to prevent naming conflicts
- Renamed `NavigationEvent` to `NavigationHistoryEvent` in context.ts for consistency
- Updated browser package to implement the correct interface properties

### Fixed

- Interface property mismatches between core and browser packages
- Naming conflicts in event interfaces
- Improved error handling in McpClient and browser package

## [0.1.0] - YYYY-MM-DD

### Added

- Initial release of the Model Context Protocol
- Core interfaces and types
- Basic browser integration
- Simple privacy filtering
- Context processing utilities
- Model client implementation
