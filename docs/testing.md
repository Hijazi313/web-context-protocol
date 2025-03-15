# Model Context Protocol - Testing Procedures

### Safari Testing

Safari compatibility is tested using a dedicated testing script:

```bash
# Run Safari compatibility test
npm run test:safari
```

This script:

1. Builds the extension specifically for Safari
2. Launches a test server with a test page
3. Provides instructions for loading the extension in Safari
4. Provides a test page with various compatibility tests

The test page checks:

- Extension detection
- Context acquisition
- Privacy controls
- User interaction tracking

To run the tests manually:

1. Build the Safari version: `npm run build:safari`
2. Enable the Develop menu in Safari:
   - Open Safari Preferences
   - Go to Advanced tab
   - Check "Show Develop menu in menu bar"
3. Allow Unsigned Extensions:
   - Click Develop in the menu bar
   - Click "Allow Unsigned Extensions"
4. Open Safari Extension Builder:
   - Click Develop > Show Extension Builder
   - Click the + button and choose "Add Extension..."
   - Select the `packages/extension/dist/safari` directory
5. Click Install and enable the extension in Safari preferences
6. Navigate to the test page at `packages/extension/test-pages/index.html`

### Cross-Browser Testing

To test compatibility across all supported browsers:

```bash
# Run all browser compatibility tests
npm run test:all
```

This will run the compatibility tests for Chrome, Firefox, and Safari in sequence.
