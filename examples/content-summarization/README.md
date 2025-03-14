# MCP Content Summarization Example

This example demonstrates how to use the Model Context Protocol (MCP) to create a content summarization application. The application captures the context of web content and uses it to generate summaries.

## Features

- Load sample articles
- Capture web context using MCP
- Generate content summaries based on the captured context
- Configure privacy levels
- View context details

## How It Works

1. The application uses the MCP to capture the DOM structure, user interactions, and other context information.
2. When the user clicks "Summarize Content", the application sends the captured context to a mock AI service.
3. The mock AI service generates a summary based on the context.
4. The summary and context details are displayed to the user.

## Implementation Details

### MCP Integration

The application uses the following MCP packages:

- `@mcp/core`: For the main client and core interfaces
- `@mcp/browser`: For the browser context provider

```typescript
import { createMcpClient, PrivacyLevel } from '@mcp/core';
import { createBrowserContextProvider } from '@mcp/browser';

// Initialize MCP Client
const provider = createBrowserContextProvider({
  observeDomMutations: true,
  trackUserInteractions: true,
  trackNavigation: true,
  maxDomDepth: 10,
});

const client = createMcpClient({
  privacyLevel: PrivacyLevel.BALANCED,
  permissions: ['dom.read', 'user.interaction'],
  scope: 'current-view',
  realTimeUpdates: false,
  maxContextSize: 1024 * 1024, // 1MB
  updateIntervalMs: 1000,
});

// Initialize the client with the provider
client.initialize(provider);
```

### Getting Context

When the user clicks "Summarize Content", the application gets the context using MCP:

```typescript
const result = await client.getContext({
  includeDOM: true,
  includeUserContext: true,
  includeAppContext: false,
  maxDepth: 5,
});
```

### Privacy Levels

The application allows the user to select different privacy levels:

```typescript
function handlePrivacyLevelChange() {
  const level = privacyLevelSelect.value as 'strict' | 'balanced' | 'permissive';
  let privacyLevel: (typeof PrivacyLevel)[keyof typeof PrivacyLevel];

  switch (level) {
    case 'strict':
      privacyLevel = PrivacyLevel.STRICT;
      break;
    case 'permissive':
      privacyLevel = PrivacyLevel.PERMISSIVE;
      break;
    case 'balanced':
    default:
      privacyLevel = PrivacyLevel.BALANCED;
      break;
  }

  client.updateOptions({
    privacyLevel,
  });
}
```

### Mock AI Service

In a real application, you would send the context to an actual AI service. This example uses a mock AI service with predefined summaries:

```typescript
// Call the mock AI service to summarize content
const response = await summarizeContent({
  context: result.context,
  options: {
    length: 'medium',
    format: 'paragraph',
    includeKeyPoints: true,
  },
});
```

## Running the Example

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:9000`

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Notes

- This example uses predefined articles and summaries for demonstration purposes.
- In a real application, you would integrate with an actual AI service for summarization.
- The MCP packages used in this example are assumed to be installed and available.
