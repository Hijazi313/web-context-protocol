/**
 * Background Service Worker for MCP Extension
 * 
 * This script runs in the background and manages:
 * - Communication between content scripts and popup/options
 * - Context storage and processing
 * - Extension state management
 * - Cross-tab context sharing
 */

import { PrivacyLevel } from '@mcp/core';
import browser from 'webextension-polyfill';

// Extension state
interface ExtensionState {
  enabled: boolean;
  privacyLevel: PrivacyLevel;
  siteSpecificSettings: Record<string, SiteSettings>;
  globalSettings: GlobalSettings;
}

interface SiteSettings {
  enabled: boolean;
  privacyLevel: PrivacyLevel;
  customRules: string[];
}

interface GlobalSettings {
  defaultPrivacyLevel: PrivacyLevel;
  enabledByDefault: boolean;
  contextSizeLimit: number;
  updateIntervalMs: number;
}

// Initialize default state
const defaultState: ExtensionState = {
  enabled: true,
  privacyLevel: PrivacyLevel.BALANCED,
  siteSpecificSettings: {},
  globalSettings: {
    defaultPrivacyLevel: PrivacyLevel.BALANCED,
    enabledByDefault: true,
    contextSizeLimit: 1024 * 1024, // 1MB
    updateIntervalMs: 1000,
  },
};

// Load state from storage
async function loadState(): Promise<ExtensionState> {
  try {
    const result = await browser.storage.local.get('mcpExtensionState');
    return result.mcpExtensionState || defaultState;
  } catch (error) {
    console.error('Failed to load state:', error);
    return defaultState;
  }
}

// Save state to storage
async function saveState(state: ExtensionState): Promise<void> {
  try {
    await browser.storage.local.set({ mcpExtensionState: state });
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}

// Get site settings for a specific URL
function getSiteSettings(state: ExtensionState, url: string): SiteSettings {
  try {
    const hostname = new URL(url).hostname;
    return (
      state.siteSpecificSettings[hostname] || {
        enabled: state.globalSettings.enabledByDefault,
        privacyLevel: state.globalSettings.defaultPrivacyLevel,
        customRules: [],
      }
    );
  } catch (error) {
    console.error('Failed to get site settings:', error);
    return {
      enabled: state.globalSettings.enabledByDefault,
      privacyLevel: state.globalSettings.defaultPrivacyLevel,
      customRules: [],
    };
  }
}

// Message handling
browser.runtime.onMessage.addListener((message, sender) => {
  // Return a promise for Firefox compatibility
  return handleMessage(message);
});

// Handle messages asynchronously
async function handleMessage(message: any) {
  const state = await loadState();

  switch (message.type) {
    case 'GET_STATE':
      return state;

    case 'GET_SITE_SETTINGS':
      return getSiteSettings(state, message.url);

    case 'UPDATE_SITE_SETTINGS':
      const { url, settings } = message;
      try {
        const hostname = new URL(url).hostname;
        const newState = {
          ...state,
          siteSpecificSettings: {
            ...state.siteSpecificSettings,
            [hostname]: settings,
          },
        };
        await saveState(newState);
        return { success: true };
      } catch (error) {
        console.error('Failed to update site settings:', error);
        return { success: false, error: String(error) };
      }

    case 'UPDATE_GLOBAL_SETTINGS':
      const newState = {
        ...state,
        globalSettings: message.settings,
      };
      await saveState(newState);
      return { success: true };

    case 'TOGGLE_EXTENSION':
      const toggledState = {
        ...state,
        enabled: message.enabled,
      };
      await saveState(toggledState);
      return { success: true };

    default:
      return { success: false, error: 'Unknown message type' };
  }
}

// Initialize extension
async function initialize() {
  // Load initial state
  const state = await loadState();
  
  // Set up context menu (if needed)
  // browser.contextMenus.create({...})
  
  console.log('MCP Extension background service initialized');
}

// Initialize when the service worker starts
initialize();

// Listen for tab updates to inject content script if needed
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if we should inject MCP on this tab
    loadState().then(state => {
      const siteSettings = getSiteSettings(state, tab.url || '');
      if (state.enabled && siteSettings.enabled) {
        // Notify content script that it should initialize MCP
        browser.tabs.sendMessage(tabId, {
          type: 'INITIALIZE_MCP',
          settings: {
            privacyLevel: siteSettings.privacyLevel,
            customRules: siteSettings.customRules,
            contextSizeLimit: state.globalSettings.contextSizeLimit,
            updateIntervalMs: state.globalSettings.updateIntervalMs,
          },
        }).catch(error => {
          // Content script might not be ready yet, which is fine
          if (!error.message?.includes('Could not establish connection')) {
            console.error('Error sending initialization message:', error);
          }
        });
      }
    });
  }
}); 