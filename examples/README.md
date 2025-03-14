# Model Context Protocol - Examples

This directory contains example applications demonstrating how to use the Model Context Protocol (MCP) in different scenarios.

## Available Examples

### Content Summarization

The [content-summarization](./content-summarization) example demonstrates how to use MCP to capture web content and generate summaries. It shows how to:

- Capture DOM structure and content
- Process the context for summarization
- Apply different privacy levels
- Display context metadata

### E-commerce Recommendations

The [ecommerce-recommendations](./ecommerce-recommendations) example demonstrates how to use MCP to track user interactions with products and generate personalized recommendations. It shows how to:

- Track user interactions with products
- Capture browsing history
- Generate personalized recommendations
- Apply different privacy levels

### Form Assistance

The [form-assistance](./form-assistance) example demonstrates how to use MCP to provide intelligent assistance for form filling. It shows how to:

- Capture form structure and user inputs
- Provide field-specific assistance
- Validate form inputs
- Apply strict privacy controls for sensitive information

## Running the Examples

Each example is a standalone application with its own package.json and build configuration. To run an example:

1. Navigate to the example directory:

   ```bash
   cd examples/content-summarization
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:9000)

## Building the Examples

To build an example for production:

```bash
npm run build
```

The built files will be in the `dist` directory of the example.

## Notes

- These examples use mock data and services for demonstration purposes.
- In a real application, you would integrate with actual backend services and AI models.
- The MCP packages used in these examples are assumed to be installed and available.
- Each example demonstrates different aspects of the MCP, but they all follow the same basic pattern of capturing context, processing it, and using it to provide intelligent features.
