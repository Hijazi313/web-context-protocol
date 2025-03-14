/**
 * Privacy Package for the Model Context Protocol
 *
 * This package provides privacy filtering, PII detection, and permission management
 * for the Model Context Protocol.
 */

// Import from relative path to fix module resolution during development
import { PrivacyLevel } from '../../core/src/interfaces/context';
import {
  PII_PATTERNS,
  SENSITIVE_SELECTORS,
  DEFAULT_PRIVACY_SETTINGS,
} from '../../core/src/utils/privacy';

/**
 * Privacy filter options
 */
export interface PrivacyFilterOptions {
  /**
   * Privacy level to apply
   */
  privacyLevel: PrivacyLevel;

  /**
   * Custom PII patterns to add to the default ones
   */
  customPatterns?: Record<string, RegExp>;

  /**
   * Custom sensitive selectors to add to the default ones
   */
  customSelectors?: string[];

  /**
   * Whether to redact form values
   */
  redactFormValues?: boolean;

  /**
   * Whether to redact URLs
   */
  redactUrls?: boolean;

  /**
   * Whether to redact cookies
   */
  redactCookies?: boolean;
}

/**
 * Privacy filter for context data
 */
export class PrivacyFilter {
  private options: PrivacyFilterOptions;
  private patterns: Record<string, RegExp>;
  private selectors: string[];

  /**
   * Create a new privacy filter
   * @param options Privacy filter options
   */
  constructor(options: PrivacyFilterOptions) {
    this.options = {
      redactFormValues: true,
      redactUrls: false,
      redactCookies: true,
      ...options,
    };

    this.patterns = { ...PII_PATTERNS };
    if (options.customPatterns) {
      this.patterns = { ...this.patterns, ...options.customPatterns };
    }

    this.selectors = [...SENSITIVE_SELECTORS];
    if (options.customSelectors) {
      this.selectors = [...this.selectors, ...options.customSelectors];
    }
  }

  /**
   * Filter context data based on privacy settings
   * @param context Context data to filter
   * @returns Filtered context data
   */
  public filterContext(context: any): any {
    if (!context) {
      return context;
    }

    const privacySettings = DEFAULT_PRIVACY_SETTINGS[this.options.privacyLevel];

    // Create a deep copy of the context to avoid modifying the original
    const filteredContext = JSON.parse(JSON.stringify(context));

    // Apply privacy filtering based on the privacy level
    if (filteredContext.dom) {
      this.filterDomContext(filteredContext.dom, privacySettings);
    }

    if (filteredContext.user) {
      this.filterUserContext(filteredContext.user, privacySettings);
    }

    if (filteredContext.app) {
      this.filterAppContext(filteredContext.app, privacySettings);
    }

    return filteredContext;
  }

  /**
   * Filter DOM context
   * @param domContext DOM context to filter
   * @param settings Privacy settings
   */
  private filterDomContext(domContext: any, settings: any): void {
    if (!domContext) {
      return;
    }

    // Filter DOM nodes recursively
    if (domContext.rootNode) {
      this.filterDomNode(domContext.rootNode, settings);
    }

    // Filter selection
    if (domContext.selection && domContext.selection.text) {
      domContext.selection.text = this.redactPII(domContext.selection.text);
    }
  }

  /**
   * Filter a DOM node
   * @param node DOM node to filter
   * @param settings Privacy settings
   */
  private filterDomNode(node: any, settings: any): void {
    if (!node) {
      return;
    }

    // Check if this is a sensitive element
    const isSensitive = this.isSensitiveElement(node);

    // Filter attributes
    if (node.attributes) {
      for (const key in node.attributes) {
        const value = node.attributes[key];
        if (typeof value === 'string') {
          if (isSensitive || this.containsPII(value)) {
            node.attributes[key] = '[REDACTED]';
          }
        }
      }
    }

    // Filter text content
    if (node.textContent && typeof node.textContent === 'string') {
      if (isSensitive || this.containsPII(node.textContent)) {
        node.textContent = this.redactPII(node.textContent);
      }
    }

    // Filter children recursively
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        this.filterDomNode(child, settings);
      }
    }
  }

  /**
   * Filter user context
   * @param userContext User context to filter
   * @param settings Privacy settings
   */
  private filterUserContext(userContext: any, settings: any): void {
    if (!userContext) {
      return;
    }

    // Filter interactions
    if (userContext.interactions && Array.isArray(userContext.interactions)) {
      if (!settings.collectInteractions) {
        userContext.interactions = [];
      } else {
        for (const interaction of userContext.interactions) {
          // Redact sensitive interaction values
          if (interaction.value && typeof interaction.value === 'string') {
            if (this.containsPII(interaction.value)) {
              interaction.value = this.redactPII(interaction.value);
            }
          }
        }
      }
    }

    // Filter preferences
    if (userContext.preferences) {
      for (const key in userContext.preferences) {
        const value = userContext.preferences[key];
        if (typeof value === 'string' && this.containsPII(value)) {
          userContext.preferences[key] = this.redactPII(value);
        }
      }
    }
  }

  /**
   * Filter application context
   * @param appContext Application context to filter
   * @param settings Privacy settings
   */
  private filterAppContext(appContext: any, settings: any): void {
    if (!appContext) {
      return;
    }

    // Filter application state
    if (appContext.state && !settings.collectAppState) {
      appContext.state = {};
    } else if (appContext.state) {
      this.filterObject(appContext.state);
    }

    // Filter components
    if (appContext.components && Array.isArray(appContext.components)) {
      for (const component of appContext.components) {
        // Filter component props
        if (component.props) {
          this.filterObject(component.props);
        }

        // Filter component state
        if (component.state) {
          this.filterObject(component.state);
        }
      }
    }
  }

  /**
   * Filter an object recursively
   * @param obj Object to filter
   */
  private filterObject(obj: any): void {
    if (!obj || typeof obj !== 'object') {
      return;
    }

    for (const key in obj) {
      const value = obj[key];

      if (typeof value === 'string') {
        if (this.containsPII(value)) {
          obj[key] = this.redactPII(value);
        }
      } else if (typeof value === 'object' && value !== null) {
        this.filterObject(value);
      }
    }
  }

  /**
   * Check if a string contains PII
   * @param text Text to check
   * @returns Whether the text contains PII
   */
  public containsPII(text: string): boolean {
    if (!text) {
      return false;
    }

    for (const pattern of Object.values(this.patterns)) {
      if (pattern.test(text)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Redact PII from a string
   * @param text Text to redact
   * @returns Redacted text
   */
  public redactPII(text: string): string {
    if (!text) {
      return text;
    }

    let redactedText = text;

    for (const [type, pattern] of Object.entries(this.patterns)) {
      redactedText = redactedText.replace(pattern, `[${type} REDACTED]`);
    }

    return redactedText;
  }

  /**
   * Check if an element is sensitive
   * @param element Element to check
   * @returns Whether the element is sensitive
   */
  public isSensitiveElement(element: any): boolean {
    if (!element) {
      return false;
    }

    // Check node name
    if (element.nodeName === 'INPUT' && element.attributes) {
      const type = element.attributes.type;
      if (type === 'password' || type === 'email' || type === 'tel' || type === 'credit-card') {
        return true;
      }
    }

    // Check attributes
    if (element.attributes) {
      for (const selector of this.selectors) {
        if (selector.startsWith('[') && selector.endsWith(']')) {
          // Attribute selector
          const attr = selector.slice(1, -1);
          if (element.attributes[attr]) {
            return true;
          }
        }
      }
    }

    return false;
  }
}

/**
 * Create a new privacy filter
 * @param options Privacy filter options
 * @returns A new privacy filter
 */
export function createPrivacyFilter(options: PrivacyFilterOptions): PrivacyFilter {
  return new PrivacyFilter(options);
}

// Re-export privacy utilities from core
export { PII_PATTERNS, SENSITIVE_SELECTORS, DEFAULT_PRIVACY_SETTINGS };
