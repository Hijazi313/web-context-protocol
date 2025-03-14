import { Context } from '@mcp/core';
import { Product, products } from './products';

export interface RecommendationRequest {
  context: Context;
  productId: string;
  options?: {
    count?: number;
    includeReasoning?: boolean;
  };
}

export interface ProductRecommendation {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  reason?: string;
}

export interface RecommendationResponse {
  recommendations: ProductRecommendation[];
  reasoning?: string;
  metadata: {
    processingTime: number;
    confidence: number;
    basedOn: string[];
  };
}

/**
 * Simulates an AI service that generates product recommendations based on context
 */
export async function getProductRecommendations(
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  const { productId, options = {} } = request;
  const { count = 4, includeReasoning = false } = options;

  // Get the current product
  const currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) {
    throw new Error(`Product with ID ${productId} not found`);
  }

  // Extract user context
  const userContext = request.context.user;
  const viewedProducts = userContext?.interactions?.filter(i => i.type === 'view') || [];
  const viewedProductIds = new Set(viewedProducts.map(v => v.target));

  // Extract app context
  const appContext = request.context.app;
  const appState = appContext?.state || {};

  // Determine recommendation strategy based on available context
  let recommendationStrategy = 'related';
  let basedOn: string[] = ['Current product'];

  if (viewedProducts.length > 0) {
    recommendationStrategy = 'personalized';
    basedOn.push('Browsing history');
  }

  if (appState.cart && Array.isArray(appState.cart) && appState.cart.length > 0) {
    recommendationStrategy = 'personalized';
    basedOn.push('Cart items');
  }

  // Get recommendations based on strategy
  let recommendedProducts: Product[] = [];

  if (recommendationStrategy === 'related') {
    // Use related products from the current product
    recommendedProducts = getRelatedProducts(currentProduct, count);
  } else {
    // Use personalized recommendations based on viewed products and current product
    recommendedProducts = getPersonalizedRecommendations(
      currentProduct,
      Array.from(viewedProductIds),
      count
    );
  }

  // Format the response
  const recommendations: ProductRecommendation[] = recommendedProducts.map(product => {
    const recommendation: ProductRecommendation = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    };

    if (includeReasoning) {
      recommendation.reason = getRecommendationReason(
        product,
        currentProduct,
        recommendationStrategy
      );
    }

    return recommendation;
  });

  // Generate overall reasoning if requested
  let reasoning: string | undefined;
  if (includeReasoning) {
    reasoning = `These recommendations are based on ${basedOn.join(', ')}. `;

    if (recommendationStrategy === 'personalized') {
      reasoning +=
        'We analyzed your browsing patterns and preferences to suggest products that match your interests.';
    } else {
      reasoning +=
        "We selected products that are frequently purchased together with the item you're viewing.";
    }
  }

  return {
    recommendations,
    reasoning,
    metadata: {
      processingTime: Math.floor(Math.random() * 300) + 100, // Random processing time between 100-400ms
      confidence: 0.7 + Math.random() * 0.25, // Random confidence between 0.7-0.95
      basedOn,
    },
  };
}

/**
 * Get related products based on the current product
 */
function getRelatedProducts(currentProduct: Product, count: number): Product[] {
  // Get products from the related products list
  const relatedProductIds = currentProduct.relatedProducts || [];
  let relatedProducts = products.filter(p => relatedProductIds.includes(p.id));

  // If we don't have enough related products, add some from the same category
  if (relatedProducts.length < count) {
    const sameCategory = products.filter(
      p =>
        p.category === currentProduct.category &&
        p.id !== currentProduct.id &&
        !relatedProductIds.includes(p.id)
    );
    relatedProducts = [...relatedProducts, ...sameCategory];
  }

  // Shuffle and limit to requested count
  return shuffleArray(relatedProducts).slice(0, count);
}

/**
 * Get personalized recommendations based on viewed products and current product
 */
function getPersonalizedRecommendations(
  currentProduct: Product,
  viewedProductIds: string[],
  count: number
): Product[] {
  // Get viewed products
  const viewedProducts = products.filter(p => viewedProductIds.includes(p.id));

  // Get categories from viewed products
  const viewedCategories = new Set(viewedProducts.map(p => p.category));

  // Get products from viewed categories, excluding already viewed products and current product
  let recommendations = products.filter(
    p =>
      viewedCategories.has(p.category) &&
      p.id !== currentProduct.id &&
      !viewedProductIds.includes(p.id)
  );

  // If we don't have enough recommendations, add related products
  if (recommendations.length < count) {
    const relatedProducts = getRelatedProducts(currentProduct, count - recommendations.length);
    recommendations = [
      ...recommendations,
      ...relatedProducts.filter(p => !recommendations.some(r => r.id === p.id)),
    ];
  }

  // Shuffle and limit to requested count
  return shuffleArray(recommendations).slice(0, count);
}

/**
 * Generate a reason for recommending a product
 */
function getRecommendationReason(
  product: Product,
  currentProduct: Product,
  strategy: string
): string {
  const reasons = [
    `Popular choice with ${currentProduct.name} buyers`,
    `Complements your ${currentProduct.category} selection`,
    `Similar features to products you've viewed`,
    `Highly rated in the ${product.category} category`,
    `Frequently bought together with ${currentProduct.name}`,
    `Based on your browsing history`,
    `Matches your interest in ${product.category}`,
    `Top seller in ${product.category}`,
  ];

  return reasons[Math.floor(Math.random() * reasons.length)];
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
