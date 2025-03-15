/**
 * Content Script for MCP Extension
 * 
 * This script is injected into web pages and is responsible for:
 * - Initializing MCP on the page
 * - Communicating with the background script
 * - Managing the in-page UI controls
 */

import { createMcpClient, PrivacyLevel } from '@mcp/core';
import { createBrowserContextProvider } from '@mcp/browser';
import browser from 'webextension-polyfill';

// MCP client instance
let mcpClient: ReturnType<typeof createMcpClient> | null = null;

// MCP provider instance
let mcpProvider: ReturnType<typeof createBrowserContextProvider> | null = null;

// Check if MCP is already present on the page
function isMcpAlreadyPresent(): boolean {
  return (
    typeof window.__MCP_CLIENT__ !== 'undefined' ||
    document.querySelector('script[data-mcp-script]') !== null
  );
}

// Initialize MCP on the page
function initializeMcp(settings: {
  privacyLevel: PrivacyLevel;
  customRules: string[];
  contextSizeLimit: number;
  updateIntervalMs: number;
}): void {
  if (isMcpAlreadyPresent()) {
    console.log('MCP is already present on the page, skipping initialization');
    return;
  }

  try {
    // Create provider
    mcpProvider = createBrowserContextProvider({
      observeDomMutations: true,
      trackUserInteractions: true,
      trackNavigation: true,
      maxDomDepth: 10,
    });

    // Create client
    mcpClient = createMcpClient({
      privacyLevel: settings.privacyLevel,
      provider: mcpProvider,
      contextSizeLimit: settings.contextSizeLimit,
      updateIntervalMs: settings.updateIntervalMs,
    });

    // Mark as initialized
    window.__MCP_CLIENT__ = mcpClient;
    
    console.log('MCP initialized by extension with privacy level:', settings.privacyLevel);
    
    // Notify background script that MCP was initialized
    browser.runtime.sendMessage({
      type: 'MCP_INITIALIZED',
      url: window.location.href,
    });
  } catch (error) {
    console.error('Failed to initialize MCP:', error);
    
    // Notify background script of failure
    browser.runtime.sendMessage({
      type: 'MCP_INITIALIZATION_FAILED',
      url: window.location.href,
      error: String(error),
    });
  }
}

// Update MCP settings
function updateMcpSettings(settings: {
  privacyLevel: PrivacyLevel;
  customRules: string[];
}): void {
  if (!mcpClient) {
    console.error('Cannot update MCP settings: MCP is not initialized');
    return;
  }

  try {
    mcpClient.updateOptions({
      privacyLevel: settings.privacyLevel,
    });
    
    console.log('MCP settings updated with privacy level:', settings.privacyLevel);
    
    // Notify background script that settings were updated
    browser.runtime.sendMessage({
      type: 'MCP_SETTINGS_UPDATED',
      url: window.location.href,
    });
  } catch (error) {
    console.error('Failed to update MCP settings:', error);
  }
}

// Dispose MCP
function disposeMcp(): void {
  if (!mcpClient) {
    return;
  }

  try {
    mcpClient.dispose();
    mcpClient = null;
    mcpProvider = null;
    delete window.__MCP_CLIENT__;
    
    console.log('MCP disposed');
    
    // Notify background script that MCP was disposed
    browser.runtime.sendMessage({
      type: 'MCP_DISPOSED',
      url: window.location.href,
    });
  } catch (error) {
    console.error('Failed to dispose MCP:', error);
  }
}

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message, sender) => {
  switch (message.type) {
    case 'INITIALIZE_MCP':
      initializeMcp(message.settings);
      return Promise.resolve({ success: true });

    case 'UPDATE_MCP_SETTINGS':
      updateMcpSettings(message.settings);
      return Promise.resolve({ success: true });

    case 'DISPOSE_MCP':
      disposeMcp();
      return Promise.resolve({ success: true });

    case 'IS_MCP_INITIALIZED':
      return Promise.resolve({ 
        initialized: mcpClient !== null,
        privacyLevel: mcpClient?.getOptions().privacyLevel
      });

    default:
      return Promise.resolve({ success: false, error: 'Unknown message type' });
  }
});

// Check if we should initialize MCP immediately
browser.runtime.sendMessage(
  { type: 'GET_SITE_SETTINGS', url: window.location.href },
  (response) => {
    if (response && response.enabled) {
      // Get global settings
      browser.runtime.sendMessage({ type: 'GET_STATE' }, (state) => {
        if (state && state.enabled) {
          initializeMcp({
            privacyLevel: response.privacyLevel,
            customRules: response.customRules,
            contextSizeLimit: state.globalSettings.contextSizeLimit,
            updateIntervalMs: state.globalSettings.updateIntervalMs,
          });
        }
      });
    }
  }
);

// Define MCP client type for window
declare global {
  interface Window {
    __MCP_CLIENT__?: any;
  }
} 