import React, { useState } from 'react';
import { PrivacyLevel } from '@mcp/core';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    defaultPrivacyLevel: PrivacyLevel.BALANCED,
    maxDomDepth: 10,
    maxContextSize: 1024 * 1024, // 1MB
    updateIntervalMs: 1000,
    defaultCategories: {
      accessibility: true,
      performance: true,
      seo: true,
      security: true,
      privacy: true,
      responsive: true,
      content: true,
    },
    reportSettings: {
      includeScreenshots: true,
      includeSourceCode: false,
      maxIssuesPerCategory: 50,
    },
  });

  const handlePrivacyLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSettings(prev => ({
      ...prev,
      defaultPrivacyLevel: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      defaultCategories: {
        ...prev.defaultCategories,
        [name]: checked,
      },
    }));
  };

  const handleReportSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? e.target.checked : parseInt(e.target.value);
    
    setSettings(prev => ({
      ...prev,
      reportSettings: {
        ...prev.reportSettings,
        [name]: value,
      },
    }));
  };

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would save these settings to localStorage or an API
    localStorage.setItem('auditSettings', JSON.stringify(settings));
    
    alert('Settings saved successfully!');
  };

  return (
    <div className="container">
      <h1>Settings</h1>
      
      <form onSubmit={saveSettings}>
        <div className="card settings-section">
          <h2 className="settings-title">Privacy Settings</h2>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="defaultPrivacyLevel">Default Privacy Level</label>
              <select
                id="defaultPrivacyLevel"
                className="form-control"
                value={settings.defaultPrivacyLevel}
                onChange={handlePrivacyLevelChange}
              >
                <option value={PrivacyLevel.STRICT}>Strict - Minimal data collection</option>
                <option value={PrivacyLevel.BALANCED}>Balanced - Moderate data collection</option>
                <option value={PrivacyLevel.PERMISSIVE}>Permissive - Maximum context</option>
              </select>
              <small className="form-text text-muted">
                This setting controls how much information is collected during audits.
              </small>
            </div>
          </div>
        </div>
        
        <div className="card settings-section">
          <h2 className="settings-title">Context Settings</h2>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="maxDomDepth">Maximum DOM Depth</label>
              <input
                type="number"
                id="maxDomDepth"
                name="maxDomDepth"
                className="form-control"
                value={settings.maxDomDepth}
                onChange={handleNumberChange}
                min="1"
                max="50"
              />
              <small className="form-text text-muted">
                Controls how deep the DOM tree is analyzed. Higher values provide more thorough analysis but may slow down the audit.
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="maxContextSize">Maximum Context Size (bytes)</label>
              <input
                type="number"
                id="maxContextSize"
                name="maxContextSize"
                className="form-control"
                value={settings.maxContextSize}
                onChange={handleNumberChange}
                min="1024"
                step="1024"
              />
              <small className="form-text text-muted">
                Maximum size of context data to collect. Larger values allow more comprehensive audits but use more memory.
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="updateIntervalMs">Update Interval (ms)</label>
              <input
                type="number"
                id="updateIntervalMs"
                name="updateIntervalMs"
                className="form-control"
                value={settings.updateIntervalMs}
                onChange={handleNumberChange}
                min="100"
                max="5000"
                step="100"
              />
              <small className="form-text text-muted">
                How frequently context updates are processed during the audit.
              </small>
            </div>
          </div>
        </div>
        
        <div className="card settings-section">
          <h2 className="settings-title">Default Audit Categories</h2>
          <div className="settings-form">
            <div className="audit-options">
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="accessibility"
                  name="accessibility"
                  checked={settings.defaultCategories.accessibility}
                  onChange={handleCategoryChange}
                />
                <label htmlFor="accessibility">Accessibility</label>
              </div>
              
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="performance"
                  name="performance"
                  checked={settings.defaultCategories.performance}
                  onChange={handleCategoryChange}
                />
                <label htmlFor="performance">Performance</label>
              </div>
              
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="seo"
                  name="seo"
                  checked={settings.defaultCategories.seo}
                  onChange={handleCategoryChange}
                />
                <label htmlFor="seo">SEO</label>
              </div>
              
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="security"
                  name="security"
                  checked={settings.defaultCategories.security}
                  onChange={handleCategoryChange}
                />
                <label htmlFor="security">Security</label>
              </div>
              
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  checked={settings.defaultCategories.privacy}
                  onChange={handleCategoryChange}
                />
                <label htmlFor="privacy">Privacy</label>
              </div>
              
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="responsive"
                  name="responsive"
                  checked={settings.defaultCategories.responsive}
                  onChange={handleCategoryChange}
                />
                <label htmlFor="responsive">Responsive Design</label>
              </div>
              
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="content"
                  name="content"
                  checked={settings.defaultCategories.content}
                  onChange={handleCategoryChange}
                />
                <label htmlFor="content">Content Quality</label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card settings-section">
          <h2 className="settings-title">Report Settings</h2>
          <div className="settings-form">
            <div className="form-group">
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="includeScreenshots"
                  name="includeScreenshots"
                  checked={settings.reportSettings.includeScreenshots}
                  onChange={handleReportSettingChange}
                />
                <label htmlFor="includeScreenshots">Include Screenshots</label>
              </div>
              
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="includeSourceCode"
                  name="includeSourceCode"
                  checked={settings.reportSettings.includeSourceCode}
                  onChange={handleReportSettingChange}
                />
                <label htmlFor="includeSourceCode">Include Source Code</label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="maxIssuesPerCategory">Maximum Issues Per Category</label>
              <input
                type="number"
                id="maxIssuesPerCategory"
                name="maxIssuesPerCategory"
                className="form-control"
                value={settings.reportSettings.maxIssuesPerCategory}
                onChange={handleReportSettingChange}
                min="1"
                max="100"
              />
              <small className="form-text text-muted">
                Limits the number of issues shown per category in the report.
              </small>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button type="submit" className="btn btn-primary">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage; 