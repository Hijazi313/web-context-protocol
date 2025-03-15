import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './popup.css';
import { PrivacyLevel } from '@mcp/core';
import browser from 'webextension-polyfill';

interface PopupState {
  enabled: boolean;
  currentUrl: string;
  hostname: string;
  siteSettings: {
    enabled: boolean;
    privacyLevel: PrivacyLevel;
    customRules: string[];
  };
  mcpInitialized: boolean;
  loading: boolean;
}

const Popup: React.FC = () => {
  const [state, setState] = useState<PopupState>({
    enabled: true,
    currentUrl: '',
    hostname: '',
    siteSettings: {
      enabled: true,
      privacyLevel: PrivacyLevel.BALANCED,
      customRules: [],
    },
    mcpInitialized: false,
    loading: true,
  });

  useEffect(() => {
    // Get current tab URL
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      const url = tabs[0]?.url || '';
      const hostname = url ? new URL(url).hostname : '';

      setState((prev) => ({
        ...prev,
        currentUrl: url,
        hostname,
      }));

      // Get extension state
      browser.runtime.sendMessage({ type: 'GET_STATE' }).then(response => {
        // Get site settings
        browser.runtime.sendMessage({ type: 'GET_SITE_SETTINGS', url })
          .then(siteSettings => {
            // Check if MCP is initialized on the page
            if (tabs[0]?.id) {
              browser.tabs.sendMessage(tabs[0].id, { type: 'IS_MCP_INITIALIZED' })
                .then(response => {
                  const mcpInitialized = response?.initialized || false;

                  setState((prev) => ({
                    ...prev,
                    enabled: response.enabled,
                    siteSettings,
                    mcpInitialized,
                    loading: false,
                  }));
                })
                .catch(() => {
                  // Content script might not be ready yet
                  setState((prev) => ({
                    ...prev,
                    enabled: response.enabled,
                    siteSettings,
                    mcpInitialized: false,
                    loading: false,
                  }));
                });
            }
          });
      });
    });
  }, []);

  const toggleExtension = (enabled: boolean) => {
    browser.runtime.sendMessage(
      { type: 'TOGGLE_EXTENSION', enabled }
    ).then(response => {
      if (response.success) {
        setState((prev) => ({
          ...prev,
          enabled,
        }));
      }
    });
  };

  const toggleSiteEnabled = (enabled: boolean) => {
    const newSettings = {
      ...state.siteSettings,
      enabled,
    };

    browser.runtime.sendMessage({
      type: 'UPDATE_SITE_SETTINGS',
      url: state.currentUrl,
      settings: newSettings,
    }).then(response => {
      if (response.success) {
        setState((prev) => ({
          ...prev,
          siteSettings: newSettings,
        }));

        // Update MCP on the page
        browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
          if (enabled && tabs[0]?.id) {
            browser.tabs.sendMessage(tabs[0].id, {
              type: 'INITIALIZE_MCP',
              settings: {
                privacyLevel: newSettings.privacyLevel,
                customRules: newSettings.customRules,
                contextSizeLimit: 1024 * 1024, // Default to 1MB
                updateIntervalMs: 1000, // Default to 1 second
              },
            });
          } else if (tabs[0]?.id) {
            browser.tabs.sendMessage(tabs[0].id, { type: 'DISPOSE_MCP' });
          }
        });
      }
    });
  };

  const changePrivacyLevel = (privacyLevel: PrivacyLevel) => {
    const newSettings = {
      ...state.siteSettings,
      privacyLevel,
    };

    browser.runtime.sendMessage({
      type: 'UPDATE_SITE_SETTINGS',
      url: state.currentUrl,
      settings: newSettings,
    }).then(response => {
      if (response.success) {
        setState((prev) => ({
          ...prev,
          siteSettings: newSettings,
        }));

        // Update MCP on the page
        browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
          if (tabs[0]?.id) {
            browser.tabs.sendMessage(tabs[0].id, {
              type: 'UPDATE_MCP_SETTINGS',
              settings: {
                privacyLevel,
                customRules: newSettings.customRules,
              },
            });
          }
        });
      }
    });
  };

  const openOptions = () => {
    browser.runtime.openOptionsPage();
  };

  if (state.loading) {
    return (
      <div className="popup">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="popup">
      <header className="header">
        <h1>Model Context Protocol</h1>
        <div className="global-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={state.enabled}
              onChange={(e) => toggleExtension(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
          <span>Enabled</span>
        </div>
      </header>

      <main className="content">
        <section className="site-section">
          <h2>Site Settings</h2>
          <div className="site-info">
            <span className="hostname">{state.hostname || 'Unknown site'}</span>
            <div className="site-toggle">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={state.siteSettings.enabled}
                  onChange={(e) => toggleSiteEnabled(e.target.checked)}
                  disabled={!state.enabled}
                />
                <span className="slider round"></span>
              </label>
              <span>Enabled for this site</span>
            </div>
          </div>
        </section>

        <section className="privacy-section">
          <h2>Privacy Level</h2>
          <div className="privacy-controls">
            <div className="privacy-option">
              <input
                type="radio"
                id="strict"
                name="privacy"
                value="strict"
                checked={state.siteSettings.privacyLevel === PrivacyLevel.STRICT}
                onChange={() => changePrivacyLevel(PrivacyLevel.STRICT)}
                disabled={!state.enabled || !state.siteSettings.enabled}
              />
              <label htmlFor="strict">
                <strong>Strict</strong>
                <p>Minimal data collection, aggressive PII filtering</p>
              </label>
            </div>

            <div className="privacy-option">
              <input
                type="radio"
                id="balanced"
                name="privacy"
                value="balanced"
                checked={state.siteSettings.privacyLevel === PrivacyLevel.BALANCED}
                onChange={() => changePrivacyLevel(PrivacyLevel.BALANCED)}
                disabled={!state.enabled || !state.siteSettings.enabled}
              />
              <label htmlFor="balanced">
                <strong>Balanced</strong>
                <p>Moderate data collection with PII filtering</p>
              </label>
            </div>

            <div className="privacy-option">
              <input
                type="radio"
                id="permissive"
                name="privacy"
                value="permissive"
                checked={state.siteSettings.privacyLevel === PrivacyLevel.PERMISSIVE}
                onChange={() => changePrivacyLevel(PrivacyLevel.PERMISSIVE)}
                disabled={!state.enabled || !state.siteSettings.enabled}
              />
              <label htmlFor="permissive">
                <strong>Permissive</strong>
                <p>Maximum context with basic PII filtering</p>
              </label>
            </div>
          </div>
        </section>

        <section className="status-section">
          <h2>Status</h2>
          <div className="status-info">
            <div className="status-item">
              <span className="status-label">MCP Status:</span>
              <span className={`status-value ${state.mcpInitialized ? 'active' : 'inactive'}`}>
                {state.mcpInitialized ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <button className="options-button" onClick={openOptions}>
          Advanced Settings
        </button>
      </footer>
    </div>
  );
};

// Initialize the popup
document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(<Popup />);
}); 