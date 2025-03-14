import './styles.css';
import { articles } from './articles';
import { summarizeContent } from './mockAiService';
import { createMcpClient, PrivacyLevel } from '@mcp/core';
import { createBrowserContextProvider } from '@mcp/browser';

// DOM Elements
const contentArea = document.getElementById('content-area') as HTMLDivElement;
const summaryArea = document.getElementById('summary-area') as HTMLDivElement;
const contextDetails = document.getElementById('context-details') as HTMLDivElement;
const summarizeBtn = document.getElementById('summarize-btn') as HTMLButtonElement;
const privacyLevelSelect = document.getElementById('privacy-level') as HTMLSelectElement;
const loadArticle1Btn = document.getElementById('load-article-1') as HTMLButtonElement;
const loadArticle2Btn = document.getElementById('load-article-2') as HTMLButtonElement;
const loadArticle3Btn = document.getElementById('load-article-3') as HTMLButtonElement;

// State
let currentArticle: string | null = null;

// Initialize MCP Client
const provider = createBrowserContextProvider({
  observeDomMutations: true,
  trackUserInteractions: true,
  trackNavigation: true,
  maxDomDepth: 10,
});

const client = createMcpClient({
  privacyLevel: PrivacyLevel.BALANCED,
  permissions: ['dom.read', 'user.interaction'],
  scope: 'current-view',
  realTimeUpdates: false,
  maxContextSize: 1024 * 1024, // 1MB
  updateIntervalMs: 1000,
});

// Initialize the client with the provider
client.initialize(provider);

// Event Listeners
loadArticle1Btn.addEventListener('click', () => loadArticle('article1'));
loadArticle2Btn.addEventListener('click', () => loadArticle('article2'));
loadArticle3Btn.addEventListener('click', () => loadArticle('article3'));
summarizeBtn.addEventListener('click', handleSummarize);
privacyLevelSelect.addEventListener('change', handlePrivacyLevelChange);

// Functions
function loadArticle(articleId: string) {
  const article = articles[articleId as keyof typeof articles];
  if (!article) return;

  contentArea.innerHTML = article.content;
  document.title = article.title;
  currentArticle = articleId;
  summarizeBtn.disabled = false;
  summaryArea.innerHTML = '<p>Click "Summarize Content" to generate a summary.</p>';
  contextDetails.innerHTML = '<p>Context details will appear here after summarization.</p>';
}

async function handleSummarize() {
  if (!currentArticle) return;

  // Show loading state
  summaryArea.innerHTML = '<div class="loading"></div>';
  contextDetails.innerHTML = '<div class="loading"></div>';
  summarizeBtn.disabled = true;

  try {
    // Get context using MCP
    const result = await client.getContext({
      includeDOM: true,
      includeUserContext: true,
      includeAppContext: false,
      maxDepth: 5,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to get context');
    }

    // Call the mock AI service to summarize content
    const response = await summarizeContent({
      context: result.context,
      options: {
        length: 'medium',
        format: 'paragraph',
        includeKeyPoints: true,
      },
    });

    // Display the summary
    let summaryHtml = `
      <p class="summary-text">${response.summary}</p>
    `;

    if (response.keyPoints && response.keyPoints.length > 0) {
      summaryHtml += `
        <h4>Key Points:</h4>
        <ul>
          ${response.keyPoints.map(point => `<li>${point}</li>`).join('')}
        </ul>
      `;
    }

    summaryHtml += `
      <div class="summary-metadata">
        <p>Processing time: ${response.metadata.processingTime}ms | Words: ${
      response.metadata.wordCount
    } | Confidence: ${(response.metadata.confidence * 100).toFixed(0)}%</p>
      </div>
    `;

    summaryArea.innerHTML = summaryHtml;

    // Display context details
    const contextMetadata = result.context.meta;
    const contextStats = {
      executionTime: result.executionTime,
      domNodes: countDomNodes(result.context.dom?.structure),
      privacyLevel: contextMetadata.privacyLevel,
      timestamp: new Date(contextMetadata.timestamp).toLocaleString(),
      url: contextMetadata.url,
    };

    contextDetails.innerHTML = `
      <div class="context-stats">
        <p><strong>Execution Time:</strong> ${contextStats.executionTime}ms</p>
        <p><strong>DOM Nodes:</strong> ${contextStats.domNodes}</p>
        <p><strong>Privacy Level:</strong> ${contextStats.privacyLevel}</p>
        <p><strong>Timestamp:</strong> ${contextStats.timestamp}</p>
        <p><strong>URL:</strong> ${contextStats.url}</p>
      </div>
    `;
  } catch (error) {
    summaryArea.innerHTML = `<p class="error">Error: ${
      error instanceof Error ? error.message : 'Unknown error'
    }</p>`;
    contextDetails.innerHTML = '<p class="error">Failed to get context details.</p>';
  } finally {
    summarizeBtn.disabled = false;
  }
}

function handlePrivacyLevelChange() {
  const level = privacyLevelSelect.value as 'strict' | 'balanced' | 'permissive';
  let privacyLevel: (typeof PrivacyLevel)[keyof typeof PrivacyLevel];

  switch (level) {
    case 'strict':
      privacyLevel = PrivacyLevel.STRICT;
      break;
    case 'permissive':
      privacyLevel = PrivacyLevel.PERMISSIVE;
      break;
    case 'balanced':
    default:
      privacyLevel = PrivacyLevel.BALANCED;
      break;
  }

  client.updateOptions({
    privacyLevel,
  });

  // Notify the user
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = `Privacy level updated to ${level}`;
  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function countDomNodes(node: any): number {
  if (!node) return 0;
  let count = 1; // Count the current node
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countDomNodes(child);
    }
  }
  return count;
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
  .notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--primary-color);
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(20px); }
  }

  .error {
    color: var(--danger-color);
    font-weight: 500;
  }

  .summary-text {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .summary-metadata {
    font-size: 0.8rem;
    color: var(--light-text);
    margin-top: 1rem;
    border-top: 1px solid var(--border-color);
    padding-top: 0.5rem;
  }
`;
document.head.appendChild(style);
