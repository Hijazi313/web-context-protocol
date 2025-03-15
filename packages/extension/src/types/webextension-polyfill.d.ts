/**
 * Type declarations for webextension-polyfill
 * 
 * This file provides TypeScript type definitions for the WebExtension API polyfill,
 * which allows for cross-browser compatibility between Chrome and Firefox.
 */

declare module 'webextension-polyfill' {
  const browser: typeof chrome;
  export default browser;
}

// Extend the Window interface to include the MCP client
interface Window {
  __MCP_CLIENT__?: any;
} 