import './styles.css';
import { products, Product } from './products';
import { getProductRecommendations } from './mockRecommendationService';
import { createMcpClient, PrivacyLevel } from '@mcp/core';
import { createBrowserContextProvider } from '@mcp/browser';

// Define app state interface
interface AppState {
  viewedProducts: {
    productId: string;
    timestamp: number;
    name: string;
    category: string;
  }[];
  currentCategory: string;
  currentProductId: string | null;
}

// Initialize app state
const appState: AppState = {
  viewedProducts: [],
  currentCategory: 'all',
  currentProductId: null,
};

// DOM Elements
const productsGrid = document.getElementById('products-grid') as HTMLDivElement;
const productDetail = document.getElementById('product-detail') as HTMLDivElement;
const backButton = document.getElementById('back-button') as HTMLButtonElement;
const productDetailContent = document.querySelector('.product-detail-content') as HTMLDivElement;
const recommendationsContainer = document.getElementById(
  'recommendations-container'
) as HTMLDivElement;
const viewedProductsList = document.getElementById('viewed-products') as HTMLUListElement;
const contextDetails = document.getElementById('context-details') as HTMLDivElement;
const privacyLevelSelect = document.getElementById('privacy-level') as HTMLSelectElement;
const currentPrivacyLevel = document.getElementById('current-privacy-level') as HTMLSpanElement;
const privacyDescription = document.getElementById('privacy-description') as HTMLParagraphElement;
const categoryLinks = document.querySelectorAll('nav a[data-category]');

// Initialize MCP Client
const provider = createBrowserContextProvider({
  observeDomMutations: true,
  trackUserInteractions: true,
  trackNavigation: true,
  maxDomDepth: 10,
});

const client = createMcpClient({
  privacyLevel: PrivacyLevel.BALANCED,
  permissions: ['dom.read', 'user.interaction', 'app.state'],
  scope: 'current-view',
  realTimeUpdates: true,
  maxContextSize: 1024 * 1024, // 1MB
  updateIntervalMs: 500,
});

// Initialize the client with the provider
client.initialize(provider);

// Event Listeners
backButton.addEventListener('click', showProductsList);
privacyLevelSelect.addEventListener('change', handlePrivacyLevelChange);

categoryLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const category = (e.currentTarget as HTMLAnchorElement).dataset.category || 'all';
    setActiveCategory(category);
    filterProducts(category);
  });
});

// Initialize the app
initializeApp();

// Functions
function initializeApp() {
  // Load products
  loadProducts();

  // Set up MCP app state
  client.setAppState({ ...appState });

  // Update privacy level description
  updatePrivacyLevelDescription(privacyLevelSelect.value as 'strict' | 'balanced' | 'permissive');
}

function loadProducts() {
  // Clear loading indicator
  productsGrid.innerHTML = '';

  // Filter products based on current category
  const filteredProducts =
    appState.currentCategory === 'all'
      ? products
      : products.filter(p => p.category === appState.currentCategory);

  // Create product cards
  filteredProducts.forEach(product => {
    const productCard = createProductCard(product);
    productsGrid.appendChild(productCard);
  });
}

function createProductCard(product: Product): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.productId = product.id;
  card.dataset.category = product.category;

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-image">
    <div class="product-info">
      <h3 class="product-title">${product.name}</h3>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <span class="product-category">${product.category}</span>
    </div>
  `;

  card.addEventListener('click', () => showProductDetails(product.id));

  return card;
}

function showProductDetails(productId: string) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Update app state
  appState.currentProductId = productId;
  trackProductView(productId);

  // Update client app state
  client.setAppState({ ...appState });

  // Show product detail view
  productsGrid.parentElement?.classList.add('hidden');
  productDetail.classList.remove('hidden');

  // Populate product details
  productDetailContent.innerHTML = `
    <div class="product-detail-image-container">
      <img src="${product.image}" alt="${product.name}" class="product-detail-image">
    </div>
    <div class="product-detail-info">
      <h2>${product.name}</h2>
      <p class="product-detail-price">$${product.price.toFixed(2)}</p>
      <p class="product-detail-description">${product.description}</p>
      <div class="product-features">
        <h3>Key Features</h3>
        <ul>
          ${product.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>
      <div class="product-specs">
        <h3>Specifications</h3>
        <table>
          ${Object.entries(product.specs)
            .map(
              ([key, value]) => `
            <tr>
              <td>${key}</td>
              <td>${value}</td>
            </tr>
          `
            )
            .join('')}
        </table>
      </div>
      <div class="product-rating">
        <p>Rating: ${product.rating.toFixed(1)}/5.0 (${product.reviews} reviews)</p>
      </div>
    </div>
  `;

  // Get recommendations
  getRecommendations(productId);

  // Update context details
  updateContextDetails();
}

function showProductsList() {
  // Hide product detail view
  productDetail.classList.add('hidden');
  productsGrid.parentElement?.classList.remove('hidden');

  // Clear current product
  appState.currentProductId = null;

  // Update client app state
  client.setAppState({ ...appState });
}

function trackProductView(productId: string) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Add to viewed products in app state
  const viewedProduct = {
    productId,
    timestamp: Date.now(),
    name: product.name,
    category: product.category,
  };

  // Check if product is already in viewed products
  const existingIndex = appState.viewedProducts.findIndex(p => p.productId === productId);
  if (existingIndex !== -1) {
    // Remove existing entry
    appState.viewedProducts.splice(existingIndex, 1);
  }

  // Add to beginning of array
  appState.viewedProducts.unshift(viewedProduct);

  // Limit to last 10 items
  if (appState.viewedProducts.length > 10) {
    appState.viewedProducts.pop();
  }

  // Update viewed products list in UI
  updateViewedProductsList();

  // Add interaction to MCP context
  client.addUserInteraction({
    type: 'view',
    target: productId,
    targetType: 'product',
    metadata: {
      productName: product.name,
      productCategory: product.category,
      timestamp: Date.now(),
    },
  });
}

function updateViewedProductsList() {
  if (appState.viewedProducts.length === 0) {
    viewedProductsList.innerHTML = '<li class="empty-message">No products viewed yet</li>';
    return;
  }

  viewedProductsList.innerHTML = '';

  appState.viewedProducts.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="#" data-product-id="${product.productId}">${product.name}</a>
      <span class="viewed-time">${formatTimeAgo(product.timestamp)}</span>
    `;

    li.querySelector('a')?.addEventListener('click', e => {
      e.preventDefault();
      showProductDetails(product.productId);
    });

    viewedProductsList.appendChild(li);
  });
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

async function getRecommendations(productId: string) {
  // Show loading state
  recommendationsContainer.innerHTML = '<div class="loading"></div>';

  try {
    // Get context using MCP
    const result = await client.getContext({
      includeDOM: true,
      includeUserContext: true,
      includeAppContext: true,
      maxDepth: 5,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to get context');
    }

    // Call the mock AI service to get recommendations
    const response = await getProductRecommendations({
      context: result.context,
      productId,
      options: {
        count: 4,
        includeReasoning: true,
      },
    });

    // Display the recommendations
    displayRecommendations(response.recommendations, response.reasoning);

    // Update context metadata
    updateContextMetadata(result.context.meta, response.metadata);
  } catch (error) {
    recommendationsContainer.innerHTML = `<p class="error">Error: ${
      error instanceof Error ? error.message : 'Unknown error'
    }</p>`;
  }
}

function displayRecommendations(recommendations: any[], reasoning?: string) {
  if (recommendations.length === 0) {
    recommendationsContainer.innerHTML = '<p>No recommendations available.</p>';
    return;
  }

  let html = '';

  if (reasoning) {
    html += `<p class="recommendation-reasoning">${reasoning}</p>`;
  }

  html += '<div class="recommendation-grid">';

  recommendations.forEach(rec => {
    html += `
      <div class="recommendation-card" data-product-id="${rec.id}">
        <img src="${rec.image}" alt="${rec.name}" class="recommendation-image">
        <div class="recommendation-info">
          <h4 class="recommendation-title">${rec.name}</h4>
          <p class="recommendation-price">$${rec.price.toFixed(2)}</p>
          ${rec.reason ? `<p class="recommendation-reason">${rec.reason}</p>` : ''}
        </div>
      </div>
    `;
  });

  html += '</div>';

  recommendationsContainer.innerHTML = html;

  // Add click event listeners to recommendation cards
  const recommendationCards = recommendationsContainer.querySelectorAll('.recommendation-card');
  recommendationCards.forEach(card => {
    card.addEventListener('click', () => {
      const productId = card.getAttribute('data-product-id');
      if (productId) {
        showProductDetails(productId);
      }
    });
  });
}

function updateContextDetails() {
  client
    .getContext({
      includeDOM: true,
      includeUserContext: true,
      includeAppContext: true,
    })
    .then(result => {
      if (result.success) {
        const context = result.context;

        // Display simplified context information
        const contextInfo = {
          timestamp: new Date(context.meta.timestamp).toLocaleString(),
          privacyLevel: context.meta.privacyLevel,
          viewedProducts: context.app?.state?.viewedProducts?.length || 0,
          interactions: context.user?.interactions?.length || 0,
          domNodes: countDomNodes(context.dom?.structure),
          executionTime: result.executionTime,
        };

        contextDetails.innerHTML = `
        <p><strong>Timestamp:</strong> ${contextInfo.timestamp}</p>
        <p><strong>Privacy Level:</strong> ${contextInfo.privacyLevel}</p>
        <p><strong>Viewed Products:</strong> ${contextInfo.viewedProducts}</p>
        <p><strong>User Interactions:</strong> ${contextInfo.interactions}</p>
        <p><strong>DOM Nodes:</strong> ${contextInfo.domNodes}</p>
        <p><strong>Execution Time:</strong> ${contextInfo.executionTime}ms</p>
      `;
      }
    });
}

function updateContextMetadata(contextMeta: any, recommendationMeta: any) {
  const metadataHtml = `
    <div class="metadata-section">
      <h4>Context Metadata</h4>
      <p><strong>Timestamp:</strong> ${new Date(contextMeta.timestamp).toLocaleString()}</p>
      <p><strong>Privacy Level:</strong> ${contextMeta.privacyLevel}</p>
      <p><strong>URL:</strong> ${contextMeta.url}</p>
    </div>
    <div class="metadata-section">
      <h4>Recommendation Metadata</h4>
      <p><strong>Processing Time:</strong> ${recommendationMeta.processingTime}ms</p>
      <p><strong>Confidence:</strong> ${(recommendationMeta.confidence * 100).toFixed(0)}%</p>
      <p><strong>Based On:</strong> ${recommendationMeta.basedOn.join(', ')}</p>
    </div>
  `;

  contextDetails.innerHTML = metadataHtml;
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

function setActiveCategory(category: string) {
  // Update app state
  appState.currentCategory = category;

  // Update active class on category links
  categoryLinks.forEach(link => {
    if (link.getAttribute('data-category') === category) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function filterProducts(category: string) {
  // Update products grid
  loadProducts();
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

  // Update UI to reflect privacy level
  updatePrivacyLevelDescription(level);

  // Show notification
  showNotification(`Privacy level updated to ${level}`);

  // Update context details
  updateContextDetails();
}

function updatePrivacyLevelDescription(level: 'strict' | 'balanced' | 'permissive') {
  currentPrivacyLevel.textContent = level.charAt(0).toUpperCase() + level.slice(1);

  switch (level) {
    case 'strict':
      privacyDescription.textContent = 'Minimal data collection with aggressive PII filtering.';
      break;
    case 'balanced':
      privacyDescription.textContent =
        'Some browsing data is collected with personal information redacted.';
      break;
    case 'permissive':
      privacyDescription.textContent = 'Comprehensive data collection with basic PII protection.';
      break;
  }
}

function showNotification(message: string) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
