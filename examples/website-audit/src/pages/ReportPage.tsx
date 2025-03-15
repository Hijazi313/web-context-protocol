import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Mock data for the report
const mockReport = {
  url: 'https://example.com',
  date: new Date().toISOString(),
  overallScore: 78,
  sections: [
    {
      id: 'accessibility',
      name: 'Accessibility',
      score: 85,
      issues: [
        {
          id: 'a11y-1',
          title: 'Missing alt text on images',
          description: 'Images must have alt text to be accessible to screen readers.',
          severity: 'high',
          location: 'img[src="/logo.png"]',
          recommendation: 'Add descriptive alt text to all images.',
        },
        {
          id: 'a11y-2',
          title: 'Low contrast text',
          description: 'Text should have sufficient contrast with its background.',
          severity: 'medium',
          location: '.header-text',
          recommendation: 'Increase contrast ratio to at least 4.5:1 for normal text.',
        },
      ],
    },
    {
      id: 'performance',
      name: 'Performance',
      score: 72,
      issues: [
        {
          id: 'perf-1',
          title: 'Large JavaScript bundle',
          description: 'JavaScript bundle size is too large, causing slow load times.',
          severity: 'high',
          location: 'main.js (1.2MB)',
          recommendation: 'Split code into smaller chunks and implement lazy loading.',
        },
        {
          id: 'perf-2',
          title: 'Unoptimized images',
          description: 'Images are not properly sized or compressed.',
          severity: 'medium',
          location: 'hero-image.jpg (2.5MB)',
          recommendation: 'Compress images and use responsive image sizes.',
        },
      ],
    },
    {
      id: 'seo',
      name: 'SEO',
      score: 90,
      issues: [
        {
          id: 'seo-1',
          title: 'Missing meta description',
          description: 'Meta description is missing on some pages.',
          severity: 'medium',
          location: '/about.html',
          recommendation: 'Add descriptive meta descriptions to all pages.',
        },
      ],
    },
    {
      id: 'security',
      name: 'Security',
      score: 65,
      issues: [
        {
          id: 'sec-1',
          title: 'Missing Content Security Policy',
          description: 'No Content Security Policy (CSP) header is set.',
          severity: 'high',
          location: 'HTTP Headers',
          recommendation: 'Implement a Content Security Policy to prevent XSS attacks.',
        },
        {
          id: 'sec-2',
          title: 'Insecure cookies',
          description: 'Cookies are not using secure and httpOnly flags.',
          severity: 'high',
          location: 'Set-Cookie header',
          recommendation: 'Set secure and httpOnly flags on all cookies.',
        },
      ],
    },
    {
      id: 'privacy',
      name: 'Privacy',
      score: 70,
      issues: [
        {
          id: 'priv-1',
          title: 'Third-party trackers without consent',
          description: 'Multiple third-party trackers are loaded without user consent.',
          severity: 'high',
          location: 'analytics.js, facebook-pixel.js',
          recommendation: 'Implement a consent management platform and only load trackers after consent.',
        },
      ],
    },
    {
      id: 'responsive',
      name: 'Responsive Design',
      score: 88,
      issues: [
        {
          id: 'resp-1',
          title: 'Overflow issues on mobile',
          description: 'Content overflows on small screens causing horizontal scrolling.',
          severity: 'medium',
          location: '.product-table',
          recommendation: 'Make tables responsive or use alternative layouts for small screens.',
        },
      ],
    },
  ],
};

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  location: string;
  recommendation: string;
}

interface Section {
  id: string;
  name: string;
  score: number;
  issues: Issue[];
}

interface Report {
  url: string;
  date: string;
  overallScore: number;
  sections: Section[];
}

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // In a real app, we would fetch the report data from an API
    // For now, we'll use the mock data
    setReport(mockReport);
    
    // Initialize all sections as expanded
    const initialExpandedState: Record<string, boolean> = {};
    mockReport.sections.forEach(section => {
      initialExpandedState[section.id] = true;
    });
    setExpandedSections(initialExpandedState);
  }, [id]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'severity-high';
      case 'medium':
        return 'severity-medium';
      case 'low':
        return 'severity-low';
      default:
        return '';
    }
  };

  const downloadReport = () => {
    if (!report) return;
    
    // In a real app, we would generate a PDF or other format
    // For now, we'll just create a JSON file
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `website-audit-${report.url.replace(/[^a-z0-9]/gi, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!report) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading report...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const pieChartData = {
    labels: report.sections.map(section => section.name),
    datasets: [
      {
        data: report.sections.map(section => section.score),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: report.sections.map(section => section.name),
    datasets: [
      {
        label: 'Score',
        data: report.sections.map(section => section.score),
        backgroundColor: 'rgba(74, 108, 247, 0.6)',
        borderColor: 'rgba(74, 108, 247, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Scores by Category',
      },
    },
  };

  return (
    <div className="container">
      <div className="report-header">
        <div>
          <h1>Audit Report</h1>
          <p>
            <strong>URL:</strong> {report.url}
          </p>
          <p>
            <strong>Date:</strong> {new Date(report.date).toLocaleString()}
          </p>
        </div>
        <div className="report-actions">
          <button className="btn btn-primary" onClick={downloadReport}>
            Download Report
          </button>
        </div>
      </div>
      
      <div className="card">
        <h2>Overall Score: {report.overallScore}/100</h2>
        <div className="report-summary">
          <div className="summary-card card">
            <div className="summary-score">{report.overallScore}</div>
            <p>Overall Score</p>
          </div>
          
          <div className="summary-card card">
            <div className="summary-score">
              {report.sections.reduce((total, section) => total + section.issues.length, 0)}
            </div>
            <p>Total Issues</p>
          </div>
          
          <div className="summary-card card">
            <div className="summary-score">
              {report.sections.reduce(
                (total, section) => 
                  total + section.issues.filter(issue => issue.severity === 'high').length, 
                0
              )}
            </div>
            <p>Critical Issues</p>
          </div>
        </div>
        
        <div className="row" style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', minWidth: '300px', padding: '1rem' }}>
            <Pie data={pieChartData} />
          </div>
          <div style={{ flex: '1 1 500px', minWidth: '500px', padding: '1rem' }}>
            <Bar data={barChartData} options={barChartOptions as any} />
          </div>
        </div>
      </div>
      
      <div className="report-sections">
        {report.sections.map(section => (
          <div key={section.id} className="card report-section">
            <div 
              className="section-header" 
              onClick={() => toggleSection(section.id)}
              style={{ cursor: 'pointer' }}
            >
              <h2>{section.name}</h2>
              <div className="section-score">
                Score: {section.score}/100
                <span style={{ marginLeft: '1rem' }}>
                  {expandedSections[section.id] ? '▼' : '►'}
                </span>
              </div>
            </div>
            
            {expandedSections[section.id] && (
              <div className="issue-list">
                {section.issues.length === 0 ? (
                  <p>No issues found. Great job!</p>
                ) : (
                  section.issues.map(issue => (
                    <div key={issue.id} className="issue-item">
                      <div className="issue-header">
                        <h3>{issue.title}</h3>
                        <span className={`issue-severity ${getSeverityClass(issue.severity)}`}>
                          {issue.severity.toUpperCase()}
                        </span>
                      </div>
                      <p>{issue.description}</p>
                      <div className="issue-location">
                        <strong>Location:</strong> {issue.location}
                      </div>
                      <p>
                        <strong>Recommendation:</strong> {issue.recommendation}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportPage; 