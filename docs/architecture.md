# Model Context Protocol - Architecture

This document outlines the architecture of the Model Context Protocol (MCP), explaining the different layers, components, and how they interact with each other.

## Overview

The Model Context Protocol (MCP) is designed to enable AI coding assistants to interact with web applications in real-time, providing secure and privacy-aware context acquisition and processing. The architecture consists of four main layers:

1. **Context Acquisition**: Capturing DOM structure, user interactions, and application state
2. **Privacy Filtering**: Ensuring sensitive information is properly handled
3. **Context Processing**: Transforming raw context into structured, relevant information
4. **Model Integration**: Enabling AI models to consume context and perform actions

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Model Integration                       │
│  (Context queries, action execution, model interaction)  │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                 Context Processing                       │
│     (Relevance filtering, entity linking, indexing)      │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                  Privacy Filtering                       │
│      (PII detection, permission management)              │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                 Context Acquisition                      │
│     (DOM observation, user interaction tracking)         │
└─────────────────────────────────────────────────────────┘
```

## Layer Descriptions

### Context Acquisition Layer

The Context Acquisition layer is responsible for capturing raw context from the web application, including:

- DOM structure and properties
- User interactions (clicks, inputs, scrolls, etc.)
- Application state and components
- Navigation events
- Viewport information

This layer is implemented primarily in the `@mcp/browser` package, which provides browser-specific implementations for context acquisition.

**Key Components:**

- DOM Mutation Observer
- User Interaction Tracker
- Navigation Tracker
- Application State Observer

### Privacy Filtering Layer

The Privacy Filtering layer ensures that sensitive information is properly handled before being processed or sent to AI models. It includes:

- PII detection and redaction
- Sensitive element identification
- Permission management
- Privacy level enforcement

This layer is implemented in the `@mcp/privacy` package, which provides privacy filtering and PII detection.

**Key Components:**

- Privacy Filter
- PII Detector
- Permission Manager
- Privacy Settings

### Context Processing Layer

The Context Processing layer transforms raw context into structured, relevant information that can be efficiently consumed by AI models. It includes:

- DOM tree pruning and transformation
- Relevance filtering
- Entity linking
- Context optimization

This layer is implemented in the `@mcp/processing` package, which provides context processing and transformation.

**Key Components:**

- Context Processor
- DOM Transformer
- Relevance Filter
- Entity Linker

### Model Integration Layer

The Model Integration layer enables AI models to consume context and perform actions on the web application. It includes:

- Context querying
- Action execution
- Model client implementation
- API integration

This layer is implemented in the `@mcp/model` package, which provides model integration and API.

**Key Components:**

- Model Client
- Context Query Engine
- Action Executor
- API Client

## Data Flow

1. **Context Acquisition**: The browser context provider captures raw context from the web application.
2. **Privacy Filtering**: The privacy filter processes the raw context to ensure sensitive information is properly handled.
3. **Context Processing**: The context processor transforms the filtered context into structured, relevant information.
4. **Model Integration**: The model client provides the processed context to AI models and executes actions on their behalf.

## Event System

The MCP architecture includes an event system that enables communication between different components and layers. The event system is implemented in the `@mcp/core` package and is used throughout the architecture.

**Key Events:**

- Context Update Events
- Privacy Level Change Events
- Navigation Events
- User Interaction Events
- Error Events

## Privacy Levels

The MCP architecture supports three privacy levels:

- **Strict**: Minimal data collection, aggressive PII filtering
- **Balanced**: Moderate data collection with PII redaction
- **Permissive**: Comprehensive data collection with basic PII protection

Each privacy level has different settings for what context is collected, how PII is handled, and what actions are allowed.

## Extensibility

The MCP architecture is designed to be extensible, allowing for:

- Custom context providers for different environments
- Custom privacy filters for specific use cases
- Custom context processors for specialized transformations
- Custom model clients for different AI models

This extensibility is achieved through well-defined interfaces and a modular architecture.
