import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './options.css';
import { PrivacyLevel } from '@mcp/core';

interface GlobalSettings {
  defaultPrivacyLevel: PrivacyLevel;
  enabledByDefault: boolean;
  contextSizeLimit: number;
  updateIntervalMs: number;
}

interface SiteSettings {
  hostname: string;
  enabled: boolean;
  privacyLevel: PrivacyLevel;
  customRules: string[];
}

interface OptionsState {
  enabled: boolean;
  globalSettings: GlobalSettings;
  siteSettings: SiteSettings[];
  loading: boolean;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  saveError: string;
}

const Options: React.FC = () => {
  const [state, setState] = useState<OptionsState>({
    enabled: true,
    globalSettings: {
      defaultPrivacyLevel: PrivacyLevel.BALANCED,
      enabledByDefault: true,
      contextSizeLimit: 1024 * 1024, // 1MB
      updateIntervalMs: 1000,
    },
    siteSettings: [],
    loading: true,
    saveStatus: 'idle',
    saveError: '',
  });

  useEffect(() => {
    // Load extension state
    chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
      if (response) {
        // Convert site settings object to array
        const siteSettingsArray = Object.entries(response.siteSpecificSettings).map(
          ([hostname, settings]) => ({
            hostname,
            ...(settings as Omit<SiteSettings, 'hostname'>),
          })
        );

        setState({
          enabled: response.enabled,
          globalSettings: response.globalSettings,
          siteSettings: siteSettingsArray,
          loading: false,
          saveStatus: 'idle',
          saveError: '',
        });
      }
    });
  }, []);

  const handleGlobalSettingsChange = (
    key: keyof GlobalSettings,
    value: string | boolean | number
  ) => {
    setState((prev) => ({
      ...prev,
      globalSettings: {
        ...prev.globalSettings,
        [key]: value,
      },
    }));
  };

  const saveGlobalSettings = () => {
    setState((prev) => ({
      ...prev,
      saveStatus: 'saving',
    }));

    chrome.runtime.sendMessage(
      {
        type: 'UPDATE_GLOBAL_SETTINGS',
        settings: state.globalSettings,
      },
      (response) => {
        if (response.success) {
          setState((prev) => ({
            ...prev,
            saveStatus: 'success',
          }));

          // Reset status after 3 seconds
          setTimeout(() => {
            setState((prev) => ({
              ...prev,
              saveStatus: 'idle',
            }));
          }, 3000);
        } else {
          setState((prev) => ({
            ...prev,
            saveStatus: 'error',
            saveError: response.error || 'Failed to save settings',
          }));
        }
      }
    );
  };

  const toggleExtension = (enabled: boolean) => {
    chrome.runtime.sendMessage(
      { type: 'TOGGLE_EXTENSION', enabled },
      (response) => {
        if (response.success) {
          setState((prev) => ({
            ...prev,
            enabled,
          }));
        }
      }
    );
  };

  const removeSiteSettings = (hostname: string) => {
    chrome.runtime.sendMessage(
      {
        type: 'UPDATE_SITE_SETTINGS',
        url: `https://${hostname}`,
        settings: null, // null to remove
      },
      (response) => {
        if (response.success) {
          setState((prev) => ({
            ...prev,
            siteSettings: prev.siteSettings.filter((site) => site.hostname !== hostname),
          }));
        }
      }
    );
  };

  if (state.loading) {
    return (
      <div className="options-container">
        <div className="loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="options-container">
      <header className="options-header">
        <h1>Model Context Protocol Settings</h1>
        <div className="global-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={state.enabled}
              onChange={(e) => toggleExtension(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
          <span>Extension Enabled</span>
        </div>
      </header>

      <main className="options-content">
        <section className="options-section">
          <h2>Global Settings</h2>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="defaultPrivacyLevel">Default Privacy Level</label>
              <select
                id="defaultPrivacyLevel"
                value={state.globalSettings.defaultPrivacyLevel}
                onChange={(e) =>
                  handleGlobalSettingsChange('defaultPrivacyLevel', Number(e.target.value))
                }
                disabled={!state.enabled}
              >
                <option value={PrivacyLevel.STRICT}>Strict</option>
                <option value={PrivacyLevel.BALANCED}>Balanced</option>
                <option value={PrivacyLevel.PERMISSIVE}>Permissive</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="enabledByDefault">Enable MCP by Default</label>
              <div className="toggle-wrapper">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={state.globalSettings.enabledByDefault}
                    onChange={(e) =>
                      handleGlobalSettingsChange('enabledByDefault', e.target.checked)
                    }
                    disabled={!state.enabled}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contextSizeLimit">Maximum Context Size (bytes)</label>
              <input
                type="number"
                id="contextSizeLimit"
                value={state.globalSettings.contextSizeLimit}
                onChange={(e) =>
                  handleGlobalSettingsChange('contextSizeLimit', Number(e.target.value))
                }
                min="1024"
                step="1024"
                disabled={!state.enabled}
              />
            </div>

            <div className="form-group">
              <label htmlFor="updateIntervalMs">Update Interval (ms)</label>
              <input
                type="number"
                id="updateIntervalMs"
                value={state.globalSettings.updateIntervalMs}
                onChange={(e) =>
                  handleGlobalSettingsChange('updateIntervalMs', Number(e.target.value))
                }
                min="100"
                step="100"
                disabled={!state.enabled}
              />
            </div>

            <div className="form-actions">
              <button
                className="save-button"
                onClick={saveGlobalSettings}
                disabled={!state.enabled || state.saveStatus === 'saving'}
              >
                {state.saveStatus === 'saving'
                  ? 'Saving...'
                  : state.saveStatus === 'success'
                  ? 'Saved!'
                  : 'Save Settings'}
              </button>
              {state.saveStatus === 'error' && (
                <div className="error-message">{state.saveError}</div>
              )}
            </div>
          </div>
        </section>

        <section className="options-section">
          <h2>Site-Specific Settings</h2>
          {state.siteSettings.length === 0 ? (
            <div className="empty-message">
              No site-specific settings yet. Visit websites with the extension enabled to add them.
            </div>
          ) : (
            <div className="site-settings-list">
              <div className="site-settings-header">
                <span className="site-hostname">Hostname</span>
                <span className="site-enabled">Enabled</span>
                <span className="site-privacy">Privacy Level</span>
                <span className="site-actions">Actions</span>
              </div>
              {state.siteSettings.map((site) => (
                <div className="site-settings-item" key={site.hostname}>
                  <span className="site-hostname">{site.hostname}</span>
                  <span className="site-enabled">
                    {site.enabled ? (
                      <span className="status-badge enabled">Enabled</span>
                    ) : (
                      <span className="status-badge disabled">Disabled</span>
                    )}
                  </span>
                  <span className="site-privacy">
                    {site.privacyLevel === PrivacyLevel.STRICT
                      ? 'Strict'
                      : site.privacyLevel === PrivacyLevel.BALANCED
                      ? 'Balanced'
                      : 'Permissive'}
                  </span>
                  <span className="site-actions">
                    <button
                      className="remove-button"
                      onClick={() => removeSiteSettings(site.hostname)}
                      title="Remove site settings"
                    >
                      Remove
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="options-footer">
        <p>
          Model Context Protocol Extension v0.1.0 |{' '}
          <a
            href="https://github.com/yourusername/mcp"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
); 