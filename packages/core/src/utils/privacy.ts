/**
 * Privacy utility functions for MCP
 *
 * These functions help with privacy-related operations such as PII detection,
 * content masking, and permission management.
 */

import { PrivacyLevel } from "../interfaces/context";

/**
 * Common PII patterns for detection
 */
export const PII_PATTERNS = {
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  PHONE: /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
  SSN: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g,
  CREDIT_CARD: /\b(?:\d[ -]*?){13,16}\b/g,
  IP_ADDRESS: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  ADDRESS:
    /\b\d+\s+([a-zA-Z]+\s+){1,5}(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Court|Ct|Lane|Ln|Way|Parkway|Pkwy)\b/gi,
  ZIP_CODE: /\b\d{5}(?:-\d{4})?\b/g,
};

/**
 * Sensitive field selectors
 */
export const SENSITIVE_SELECTORS = [
  'input[type="password"]',
  'input[type="email"]',
  'input[name*="password"]',
  'input[name*="email"]',
  'input[name*="username"]',
  'input[name*="user"]',
  'input[name*="login"]',
  'input[name*="card"]',
  'input[name*="credit"]',
  'input[name*="cvv"]',
  'input[name*="ssn"]',
  'input[name*="social"]',
  'input[name*="security"]',
  'input[name*="address"]',
  'input[name*="phone"]',
  'input[name*="zip"]',
  'input[name*="postal"]',
  'input[autocomplete="current-password"]',
  'input[autocomplete="new-password"]',
  'input[autocomplete="cc-number"]',
  'input[autocomplete="cc-csc"]',
  'input[autocomplete="cc-exp"]',
  'input[autocomplete="email"]',
  'input[autocomplete="tel"]',
  'input[autocomplete="street-address"]',
  'input[autocomplete="postal-code"]',
];

/**
 * Default privacy settings for different privacy levels
 */
export const DEFAULT_PRIVACY_SETTINGS = {
  strict: {
    maskPII: true,
    maskSensitiveFields: true,
    collectFormData: false,
    collectUserInteractions: false,
    collectFullDOM: false,
    collectMetadata: true,
    collectURLs: true,
    collectTitles: true,
    maxHistoryDepth: 0,
    maxInteractionHistory: 0,
  },
  balanced: {
    maskPII: true,
    maskSensitiveFields: true,
    collectFormData: false,
    collectUserInteractions: true,
    collectFullDOM: true,
    collectMetadata: true,
    collectURLs: true,
    collectTitles: true,
    maxHistoryDepth: 5,
    maxInteractionHistory: 20,
  },
  permissive: {
    maskPII: true,
    maskSensitiveFields: true,
    collectFormData: true,
    collectUserInteractions: true,
    collectFullDOM: true,
    collectMetadata: true,
    collectURLs: true,
    collectTitles: true,
    maxHistoryDepth: 10,
    maxInteractionHistory: 50,
  },
};

/**
 * Check if a string contains PII
 *
 * @param text - The text to check
 * @returns Whether the text contains PII
 */
export function containsPII(text: string): boolean {
  if (!text) {
    return false;
  }

  for (const pattern of Object.values(PII_PATTERNS)) {
    if (pattern.test(text)) {
      // Reset the regex lastIndex to avoid issues with subsequent calls
      pattern.lastIndex = 0;
      return true;
    }
  }

  return false;
}

/**
 * Redact PII from a string
 *
 * @param text - The text to redact
 * @returns The redacted text
 */
export function redactPII(text: string): string {
  if (!text) {
    return text;
  }

  let redactedText = text;

  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    redactedText = redactedText.replace(pattern, `[REDACTED ${type}]`);
    // Reset the regex lastIndex to avoid issues with subsequent calls
    pattern.lastIndex = 0;
  }

  return redactedText;
}

/**
 * Check if an element matches any sensitive selector
 *
 * @param element - The element to check
 * @returns Whether the element is sensitive
 */
export function isSensitiveElement(element: Element): boolean {
  return SENSITIVE_SELECTORS.some((selector) => element.matches(selector));
}

/**
 * Get privacy settings for a specific privacy level
 *
 * @param level - The privacy level
 * @returns The privacy settings
 */
export function getPrivacySettings(level: PrivacyLevel) {
  return DEFAULT_PRIVACY_SETTINGS[level];
}

/**
 * Check if a permission is allowed for a specific privacy level
 *
 * @param permission - The permission to check
 * @param level - The privacy level
 * @returns Whether the permission is allowed
 */
export function isPermissionAllowed(
  permission: string,
  level: PrivacyLevel
): boolean {
  const settings = getPrivacySettings(level);

  switch (permission) {
    case "dom.read":
      return settings.collectFullDOM;
    case "dom.write":
      return level === "permissive";
    case "user.interaction":
      return settings.collectUserInteractions;
    case "form.read":
      return settings.collectFormData;
    case "navigation":
      return settings.maxHistoryDepth > 0;
    default:
      return false;
  }
}
