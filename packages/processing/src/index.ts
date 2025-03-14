/**
 * Processing Package for the Model Context Protocol
 *
 * This package provides context processing, transformation, and relevance filtering
 * for the Model Context Protocol.
 */

// Import from relative path to fix module resolution during development
import { Context, ContextQuery } from '../../core/src/interfaces/context';
import { PrivacyFilter } from '../../privacy/src/index';

/**
 * Context processor options
 */
export interface ContextProcessorOptions {
  /**
   * Maximum depth of DOM tree to include
   */
  maxDomDepth?: number;

  /**
   * Whether to include text content
   */
  includeTextContent?: boolean;

  /**
   * Whether to include computed styles
   */
  includeStyles?: boolean;

  /**
   * Whether to include accessibility information
   */
  includeAccessibility?: boolean;

  /**
   * Whether to include bounding rectangles
   */
  includeBoundingRects?: boolean;

  /**
   * Maximum number of interactions to include
   */
  maxInteractions?: number;

  /**
   * Whether to include component tree
   */
  includeComponents?: boolean;
}

/**
 * Context processor for transforming and filtering context data
 */
export class ContextProcessor {
  private options: ContextProcessorOptions;
  private privacyFilter: PrivacyFilter | null = null;

  /**
   * Create a new context processor
   * @param options Context processor options
   */
  constructor(options: ContextProcessorOptions = {}) {
    this.options = {
      maxDomDepth: 10,
      includeTextContent: true,
      includeStyles: false,
      includeAccessibility: true,
      includeBoundingRects: true,
      maxInteractions: 20,
      includeComponents: true,
      ...options,
    };
  }

  /**
   * Set the privacy filter
   * @param filter Privacy filter
   */
  public setPrivacyFilter(filter: PrivacyFilter): void {
    this.privacyFilter = filter;
  }

  /**
   * Process context data
   * @param context Context data to process
   * @param query Context query
   * @returns Processed context data
   */
  public processContext(context: Context, query: ContextQuery): Context {
    if (!context) {
      return context;
    }

    // Apply privacy filtering if a privacy filter is set
    let processedContext = context;
    if (this.privacyFilter) {
      processedContext = this.privacyFilter.filterContext(context);
    }

    // Apply transformations based on the query and options
    processedContext = this.applyTransformations(processedContext, query);

    return processedContext;
  }

  /**
   * Apply transformations to the context data
   * @param context Context data to transform
   * @param query Context query
   * @returns Transformed context data
   */
  private applyTransformations(context: Context, query: ContextQuery): Context {
    // Create a deep copy of the context to avoid modifying the original
    const transformedContext = JSON.parse(JSON.stringify(context));

    // Apply DOM transformations
    if (transformedContext.dom && transformedContext.dom.rootNode) {
      this.transformDomNode(transformedContext.dom.rootNode, 0, query);
    }

    // Apply user context transformations
    if (transformedContext.user && transformedContext.user.interactions) {
      this.transformInteractions(transformedContext.user.interactions, query);
    }

    // Apply app context transformations
    if (transformedContext.app && transformedContext.app.components) {
      this.transformComponents(transformedContext.app.components, query);
    }

    return transformedContext;
  }

  /**
   * Transform a DOM node
   * @param node DOM node to transform
   * @param depth Current depth in the DOM tree
   * @param query Context query
   */
  private transformDomNode(node: any, depth: number, query: any): void {
    if (!node) {
      return;
    }

    // Apply depth limit
    const maxDepth = query.maxDepth || this.options.maxDomDepth;
    if (depth > maxDepth) {
      node.children = [];
      return;
    }

    // Remove or keep text content
    if (!this.options.includeTextContent) {
      delete node.textContent;
    }

    // Remove or keep styles
    if (!this.options.includeStyles) {
      delete node.styles;
    }

    // Remove or keep accessibility information
    if (!this.options.includeAccessibility) {
      delete node.accessibility;
    }

    // Remove or keep bounding rectangles
    if (!this.options.includeBoundingRects) {
      delete node.boundingRect;
    }

    // Transform children recursively
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        this.transformDomNode(child, depth + 1, query);
      }
    }
  }

  /**
   * Transform user interactions
   * @param interactions User interactions to transform
   * @param query Context query
   */
  private transformInteractions(interactions: any[], query: any): void {
    if (!interactions || !Array.isArray(interactions)) {
      return;
    }

    // Apply limit to the number of interactions
    const maxInteractions = query.maxInteractions || this.options.maxInteractions;
    if (interactions.length > maxInteractions) {
      interactions.splice(maxInteractions);
    }
  }

  /**
   * Transform application components
   * @param components Application components to transform
   * @param query Context query
   */
  private transformComponents(components: any[], query: any): void {
    if (!components || !Array.isArray(components)) {
      return;
    }

    // If components should not be included, clear the array
    if (!this.options.includeComponents) {
      components.splice(0);
      return;
    }

    // Transform each component
    for (const component of components) {
      // Transform child components recursively
      if (component.children && Array.isArray(component.children)) {
        this.transformComponents(component.children, query);
      }
    }
  }
}

/**
 * Create a new context processor
 * @param options Context processor options
 * @returns A new context processor
 */
export function createContextProcessor(options?: ContextProcessorOptions): ContextProcessor {
  return new ContextProcessor(options);
}
