# MCP E-commerce Recommendations Example

This example demonstrates how to use the Model Context Protocol (MCP) to create an e-commerce product recommendations application. The application captures the context of user interactions with products and uses it to generate personalized recommendations.

## Features

- Browse sample products
- View product details
- Capture user interactions using MCP
- Generate personalized product recommendations
- Configure privacy levels
- View browsing history and interaction data

## How It Works

1. The application uses the MCP to capture the DOM structure, user interactions (clicks, scrolls, views), and other context information.
2. As the user browses products, their interactions are tracked and stored in the context.
3. When viewing a product, the application sends the captured context to a mock AI service.
4. The mock AI service generates personalized product recommendations based on the context.
5. The recommendations are displayed to the user.

## Implementation Details

### MCP Integration

The application uses the following MCP packages:

- `@mcp/core`: For the main client and core interfaces
- `@mcp/browser`: For the browser context provider
- `@mcp/privacy`: For privacy filtering

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
  permissions: ['dom.read', 'user.interaction', 'app.state'],
  scope: 'current-view',
  realTimeUpdates: true,
  maxContextSize: 1024 * 1024, // 1MB
  updateIntervalMs: 500,
});

// Initialize the client with the provider
client.initialize(provider);
```

### Tracking User Interactions

The application tracks user interactions with products:

```typescript
// Track product view
function trackProductView(productId: string) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Update app state
  appState.viewedProducts.push({
    productId,
    timestamp: Date.now(),
    name: product.name,
    category: product.category,
  });

  // Limit history to last 10 items
  if (appState.viewedProducts.length > 10) {
    appState.viewedProducts.shift();
  }

  // Update DOM with custom data attribute for MCP to capture
  const productElement = document.querySelector(`[data-product-id="${productId}"]`);
  if (productElement) {
    productElement.setAttribute('data-viewed', 'true');
    productElement.setAttribute('data-view-time', Date.now().toString());
  }
}
```

### Getting Recommendations

When the user views a product, the application gets the context and generates recommendations:

```typescript
async function getRecommendations(productId: string) {
  // Show loading state
  recommendationsContainer.innerHTML = '<div class="loading"></div>';

  try {
    // Get context using MCP
    const result = await client.getContext({
      includeDOM: true,
      includeUserContext: true,
      includeAppContext: true,
      maxDepth: 5,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to get context');
    }

    // Call the mock AI service to get recommendations
    const response = await getProductRecommendations({
      context: result.context,
      productId,
      options: {
        count: 4,
        includeReasoning: true,
      },
    });

    // Display the recommendations
    displayRecommendations(response.recommendations, response.reasoning);
  } catch (error) {
    recommendationsContainer.innerHTML = `<p class="error">Error: ${
      error instanceof Error ? error.message : 'Unknown error'
    }</p>`;
  }
}
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

  // Update UI to reflect privacy level
  document.body.setAttribute('data-privacy-level', level);
}
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

- This example uses mock products and recommendations for demonstration purposes.
- In a real application, you would integrate with an actual e-commerce backend and AI service.
- The MCP packages used in this example are assumed to be installed and available.
