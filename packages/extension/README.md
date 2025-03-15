# Model Context Protocol Browser Extension

This browser extension implements the Model Context Protocol (MCP) to enable AI-powered context awareness in web applications.

## Features

- Cross-browser compatibility (Chrome, Firefox, Safari)
- Privacy-focused context acquisition
- Configurable privacy levels
- Developer tools for debugging
- Example applications integration

## Installation

### Chrome

1. Build the extension:
```bash
npm run build:chrome
```

2. Load the extension:
- Open Chrome and navigate to `chrome://extensions`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist/chrome` directory

### Firefox

1. Build the extension:
```bash
npm run build:firefox
```

2. Load the extension:
- Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
- Click "Load Temporary Add-on..."
- Select the `dist/firefox/manifest.json` file

### Safari

1. Build the extension:
```bash
npm run build:safari
```

2. Load the extension:
- Enable the Develop menu in Safari:
  - Open Safari Preferences
  - Go to Advanced tab
  - Check "Show Develop menu in menu bar"
- Allow Unsigned Extensions:
  - Click Develop in the menu bar
  - Click "Allow Unsigned Extensions"
- Open Safari Extension Builder:
  - Click Develop > Show Extension Builder
  - Click the + button and choose "Add Extension..."
  - Select the `dist/safari` directory
- Click Install and enable the extension in Safari preferences

## Development

### Setup

```bash
# Install dependencies
npm install

# Build all versions
npm run build

# Build specific browser version
npm run build:chrome
npm run build:firefox
npm run build:safari

# Development with hot reload
npm run dev:chrome
npm run dev:firefox
npm run dev:safari
```

### Testing

```bash
# Run unit tests
npm test

# Run browser compatibility tests
npm run test:chrome
npm run test:firefox
npm run test:safari

# Run all browser compatibility tests
npm run test:all
```

### Linting

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Browser Support

- Chrome 80+
- Firefox 78+
- Safari 14+

## Architecture

The extension follows a modular architecture:

1. **Background Script**: Manages state and coordinates between components
2. **Content Script**: Injects MCP into web pages
3. **Popup UI**: Provides quick access to settings
4. **Options Page**: Provides comprehensive configuration
5. **Developer Tools**: Provides debugging capabilities

## Privacy

Privacy is a core concern of the MCP extension. Users can choose between three privacy levels:

- **Strict**: Minimal context collection
- **Balanced**: Moderate context collection with PII protection
- **Permissive**: Full context collection with user consent

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 