import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMcpClient, PrivacyLevel } from '@mcp/core';
import { createBrowserContextProvider } from '@mcp/browser';

interface AuditOptions {
  accessibility: boolean;
  performance: boolean;
  seo: boolean;
  security: boolean;
  privacy: boolean;
  responsive: boolean;
  content: boolean;
}

const AuditPage: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isAuditing, setIsAuditing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(PrivacyLevel.BALANCED);
  const [options, setOptions] = useState<AuditOptions>({
    accessibility: true,
    performance: true,
    seo: true,
    security: true,
    privacy: true,
    responsive: true,
    content: true,
  });

  const validateUrl = (value: string) => {
    try {
      new URL(value);
      setIsValidUrl(true);
      return true;
    } catch (error) {
      setIsValidUrl(false);
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    if (value) {
      validateUrl(value);
    } else {
      setIsValidUrl(true);
    }
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOptions(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handlePrivacyLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setPrivacyLevel(value);
  };

  const startAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url || !validateUrl(url)) {
      return;
    }

    setIsAuditing(true);
    setProgress(0);

    try {
      // Create a browser context provider
      const provider = createBrowserContextProvider({
        observeDomMutations: true,
        trackUserInteractions: true,
        trackNavigation: true,
        maxDomDepth: 10,
      });

      // Create an MCP client
      const client = createMcpClient({
        privacyLevel,
        permissions: ['dom.read', 'user.interaction'],
        scope: 'current-view',
        realTimeUpdates: true,
        maxContextSize: 1024 * 1024, // 1MB
        updateIntervalMs: 1000,
      });

      // Initialize the client with the provider
      client.initialize(provider);

      // Simulate audit progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            
            // Navigate to report page with a mock report ID
            setTimeout(() => {
              navigate('/report/mock-report-id');
            }, 500);
            
            return 100;
          }
          return newProgress;
        });
      }, 300);

      // Get context
      const result = await client.getContext({
        includeDOM: true,
        includeUserContext: true,
        maxDepth: 5,
      });

      if (result.success) {
        console.log('Context:', result.context);
        console.log('Execution time:', result.executionTime, 'ms');
      } else {
        console.error('Error:', result.error);
        clearInterval(progressInterval);
        setIsAuditing(false);
      }

      // Clean up when done
      const cleanup = () => {
        client.dispose();
      };

      // This would be called when component unmounts
      return cleanup;
    } catch (error) {
      console.error('Audit error:', error);
      setIsAuditing(false);
    }
  };

  return (
    <div className="container">
      <h1>Website Audit</h1>
      
      <div className="card">
        <form className="audit-form" onSubmit={startAudit}>
          <div className="form-group">
            <label htmlFor="url">Website URL</label>
            <input
              type="text"
              id="url"
              className={`form-control ${!isValidUrl ? 'is-invalid' : ''}`}
              placeholder="https://example.com"
              value={url}
              onChange={handleUrlChange}
              disabled={isAuditing}
              required
            />
            {!isValidUrl && (
              <div className="alert alert-danger">
                Please enter a valid URL (e.g., https://example.com)
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>Audit Categories</label>
            <div className="audit-options">
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="accessibility"
                  name="accessibility"
                  checked={options.accessibility}
                  onChange={handleOptionChange}
                  disabled={isAuditing}
                />
                <label htmlFor="accessibility">Accessibility</label>
              </div>
              
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="performance"
                  name="performance"
                  checked={options.performance}
                  onChange={handleOptionChange}
                  disabled={isAuditing}
                />
                <label htmlFor="performance">Performance</label>
              </div>
              
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="seo"
                  name="seo"
                  checked={options.seo}
                  onChange={handleOptionChange}
                  disabled={isAuditing}
                />
                <label htmlFor="seo">SEO</label>
              </div>
              
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="security"
                  name="security"
                  checked={options.security}
                  onChange={handleOptionChange}
                  disabled={isAuditing}
                />
                <label htmlFor="security">Security</label>
              </div>
              
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  checked={options.privacy}
                  onChange={handleOptionChange}
                  disabled={isAuditing}
                />
                <label htmlFor="privacy">Privacy</label>
              </div>
              
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="responsive"
                  name="responsive"
                  checked={options.responsive}
                  onChange={handleOptionChange}
                  disabled={isAuditing}
                />
                <label htmlFor="responsive">Responsive Design</label>
              </div>
              
              <div className="audit-option">
                <input
                  type="checkbox"
                  id="content"
                  name="content"
                  checked={options.content}
                  onChange={handleOptionChange}
                  disabled={isAuditing}
                />
                <label htmlFor="content">Content Quality</label>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="privacyLevel">Privacy Level</label>
            <select
              id="privacyLevel"
              className="form-control"
              value={privacyLevel}
              onChange={handlePrivacyLevelChange}
              disabled={isAuditing}
            >
              <option value={PrivacyLevel.STRICT}>Strict - Minimal data collection</option>
              <option value={PrivacyLevel.BALANCED}>Balanced - Moderate data collection</option>
              <option value={PrivacyLevel.PERMISSIVE}>Permissive - Maximum context</option>
            </select>
          </div>
          
          {isAuditing && (
            <div className="audit-progress">
              <p>Auditing website... {progress}%</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isAuditing || !url || !isValidUrl}
            >
              {isAuditing ? 'Auditing...' : 'Start Audit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuditPage; 