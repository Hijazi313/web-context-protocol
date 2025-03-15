#!/usr/bin/env node

/**
 * Safari Compatibility Test Script
 * 
 * This script helps test the MCP extension in Safari by:
 * 1. Building the extension for Safari
 * 2. Starting a test server with a test page
 * 3. Providing instructions for loading the extension in Safari
 * 
 * Prerequisites:
 * - Safari 14+ installed
 * - Xcode installed with Command Line Tools
 * - Safari Developer Menu enabled
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuration
const DIST_DIR = path.join(__dirname, '..', 'dist', 'safari');
const TEST_PAGE_DIR = path.join(__dirname, '..', 'test-pages');
const TEST_PAGE_PORT = 8080;

// Ensure the test page directory exists
if (!fs.existsSync(TEST_PAGE_DIR)) {
  fs.mkdirSync(TEST_PAGE_DIR, { recursive: true });
}

// Create a simple test page (reusing the same test page as other browsers)
const testPagePath = path.join(TEST_PAGE_DIR, 'index.html');
const testPageContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MCP Browser Compatibility Test</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 {
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .test-section {
      margin-bottom: 30px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .test-section h2 {
      margin-top: 0;
    }
    button {
      background-color: #4CAF50;
      border: none;
      color: white;
      padding: 10px 15px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 4px;
    }
    .result {
      margin-top: 10px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
      min-height: 20px;
    }
    .safari-note {
      background-color: #fff3cd;
      border: 1px solid #ffeeba;
      color: #856404;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="safari-note">
    <strong>Safari-Specific Note:</strong>
    <p>Make sure you have enabled the Develop menu in Safari preferences and allowed Unsigned Extensions in the Develop menu.</p>
  </div>

  <h1>MCP Browser Compatibility Test</h1>
  
  <div class="test-section">
    <h2>Extension Detection</h2>
    <p>This test checks if the MCP extension is properly loaded in Safari.</p>
    <button id="checkExtension">Check Extension</button>
    <div id="extensionResult" class="result"></div>
  </div>

  <div class="test-section">
    <h2>Context Acquisition</h2>
    <p>This test checks if the MCP extension can acquire context from the page.</p>
    <button id="checkContext">Check Context</button>
    <div id="contextResult" class="result"></div>
  </div>

  <div class="test-section">
    <h2>Privacy Controls</h2>
    <p>This test checks if the privacy controls are working properly.</p>
    <button id="checkPrivacy">Check Privacy Controls</button>
    <div id="privacyResult" class="result"></div>
  </div>

  <div class="test-section">
    <h2>User Interaction</h2>
    <p>This test checks if user interactions are properly tracked.</p>
    <button id="trackInteraction">Track Interaction</button>
    <div id="interactionResult" class="result"></div>
  </div>

  <script>
    // Check if extension is loaded
    document.getElementById('checkExtension').addEventListener('click', function() {
      const result = document.getElementById('extensionResult');
      
      if (window.__MCP_CLIENT__) {
        result.textContent = 'Success: MCP extension is loaded!';
        result.style.color = 'green';
      } else {
        result.textContent = 'Failure: MCP extension is not loaded. Make sure it\\'s enabled in Safari\\'s Extension preferences.';
        result.style.color = 'red';
      }
    });

    // Check context acquisition
    document.getElementById('checkContext').addEventListener('click', function() {
      const result = document.getElementById('contextResult');
      
      if (window.__MCP_CLIENT__) {
        try {
          const context = window.__MCP_CLIENT__.getContext();
          result.textContent = 'Success: Context acquired! Context size: ' + 
            JSON.stringify(context).length + ' bytes';
          result.style.color = 'green';
        } catch (error) {
          result.textContent = 'Failure: Error acquiring context: ' + error.message;
          result.style.color = 'red';
        }
      } else {
        result.textContent = 'Failure: MCP extension is not loaded.';
        result.style.color = 'red';
      }
    });

    // Check privacy controls
    document.getElementById('checkPrivacy').addEventListener('click', function() {
      const result = document.getElementById('privacyResult');
      
      if (window.__MCP_CLIENT__) {
        try {
          const options = window.__MCP_CLIENT__.getOptions();
          result.textContent = 'Success: Privacy level is set to: ' + 
            (options.privacyLevel === 0 ? 'Strict' : 
             options.privacyLevel === 1 ? 'Balanced' : 'Permissive');
          result.style.color = 'green';
        } catch (error) {
          result.textContent = 'Failure: Error checking privacy controls: ' + error.message;
          result.style.color = 'red';
        }
      } else {
        result.textContent = 'Failure: MCP extension is not loaded.';
        result.style.color = 'red';
      }
    });

    // Track user interaction
    document.getElementById('trackInteraction').addEventListener('click', function() {
      const result = document.getElementById('interactionResult');
      
      if (window.__MCP_CLIENT__) {
        // Create a test element to interact with
        const testElement = document.createElement('div');
        testElement.id = 'testElement';
        testElement.textContent = 'Test Element';
        testElement.style.padding = '10px';
        testElement.style.backgroundColor = '#eee';
        testElement.style.marginTop = '10px';
        
        // Add it to the page
        result.appendChild(testElement);
        
        // Simulate interaction
        testElement.click();
        
        // Check if interaction was tracked
        setTimeout(() => {
          try {
            const context = window.__MCP_CLIENT__.getContext();
            const interactions = context.userContext?.interactions || [];
            
            if (interactions.some(i => i.element?.id === 'testElement')) {
              result.textContent = 'Success: User interaction was tracked!';
              result.style.color = 'green';
            } else {
              result.textContent = 'Failure: User interaction was not tracked.';
              result.style.color = 'red';
            }
          } catch (error) {
            result.textContent = 'Failure: Error checking user interaction: ' + error.message;
            result.style.color = 'red';
          }
        }, 500);
      } else {
        result.textContent = 'Failure: MCP extension is not loaded.';
        result.style.color = 'red';
      }
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(testPagePath, testPageContent);

// Build the extension for Safari
console.log('Building extension for Safari...');
try {
  execSync('npm run build:safari', { stdio: 'inherit' });
  console.log('Build successful!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Start a simple HTTP server for the test page
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(testPageContent);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(TEST_PAGE_PORT, () => {
  console.log(`Test server running at http://localhost:${TEST_PAGE_PORT}`);
  console.log('\nTo test the extension in Safari:');
  console.log('1. Enable the Develop menu in Safari:');
  console.log('   - Open Safari Preferences');
  console.log('   - Go to Advanced tab');
  console.log('   - Check "Show Develop menu in menu bar"');
  console.log('2. Allow Unsigned Extensions:');
  console.log('   - Click Develop in the menu bar');
  console.log('   - Click "Allow Unsigned Extensions"');
  console.log('3. Open Safari Extension Builder:');
  console.log('   - Click Develop > Show Extension Builder');
  console.log('   - Click the + button and choose "Add Extension..."');
  console.log(`   - Navigate to and select: ${DIST_DIR}`);
  console.log('4. Click Install and enable the extension in Safari preferences');
  console.log('5. Once the extension is loaded, navigate to:');
  console.log(`   http://localhost:${TEST_PAGE_PORT}`);
  console.log('6. Use the test buttons on the page to verify functionality');
  console.log('\nPress Ctrl+C to stop the test server when finished.\n');
}); 