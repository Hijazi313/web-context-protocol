import {
  containsPII,
  redactPII,
  isSensitiveElement,
  getPrivacySettings,
  isPermissionAllowed,
  PII_PATTERNS,
  SENSITIVE_SELECTORS,
  DEFAULT_PRIVACY_SETTINGS,
} from '../privacy';

describe('Privacy Utilities', () => {
  describe('containsPII', () => {
    test('should detect email addresses', () => {
      expect(containsPII('My email is john.doe@example.com')).toBe(true);
    });

    test('should detect phone numbers', () => {
      expect(containsPII('Call me at 123-456-7890')).toBe(true);
      expect(containsPII('Call me at (123) 456-7890')).toBe(true);
    });

    test('should detect SSNs', () => {
      expect(containsPII('My SSN is 123-45-6789')).toBe(true);
    });

    test('should detect credit card numbers', () => {
      expect(containsPII('My card number is 4111 1111 1111 1111')).toBe(true);
    });

    test('should return false for text without PII', () => {
      expect(containsPII('This is a regular text without any PII')).toBe(false);
    });
  });

  describe('redactPII', () => {
    test('should redact email addresses', () => {
      expect(redactPII('My email is john.doe@example.com')).toBe('My email is [EMAIL REDACTED]');
    });

    test('should redact phone numbers', () => {
      expect(redactPII('Call me at 123-456-7890')).toBe('Call me at [PHONE REDACTED]');
    });

    test('should redact multiple PII instances', () => {
      expect(redactPII('Email: john@example.com, Phone: 123-456-7890')).toBe(
        'Email: [EMAIL REDACTED], Phone: [PHONE REDACTED]'
      );
    });

    test('should not modify text without PII', () => {
      const text = 'This is a regular text without any PII';
      expect(redactPII(text)).toBe(text);
    });
  });

  describe('isSensitiveElement', () => {
    test('should identify password inputs', () => {
      const element = document.createElement('input');
      element.type = 'password';
      expect(isSensitiveElement(element)).toBe(true);
    });

    test('should identify credit card inputs', () => {
      const element = document.createElement('input');
      element.setAttribute('name', 'credit-card');
      expect(isSensitiveElement(element)).toBe(true);
    });

    test('should return false for non-sensitive elements', () => {
      const element = document.createElement('div');
      expect(isSensitiveElement(element)).toBe(false);
    });
  });

  describe('getPrivacySettings', () => {
    test('should return settings for strict privacy level', () => {
      const settings = getPrivacySettings('strict');
      expect(settings).toEqual(DEFAULT_PRIVACY_SETTINGS.strict);
    });

    test('should return settings for balanced privacy level', () => {
      const settings = getPrivacySettings('balanced');
      expect(settings).toEqual(DEFAULT_PRIVACY_SETTINGS.balanced);
    });

    test('should return settings for permissive privacy level', () => {
      const settings = getPrivacySettings('permissive');
      expect(settings).toEqual(DEFAULT_PRIVACY_SETTINGS.permissive);
    });

    test('should default to balanced if invalid level provided', () => {
      const settings = getPrivacySettings('invalid' as any);
      expect(settings).toEqual(DEFAULT_PRIVACY_SETTINGS.balanced);
    });
  });

  describe('isPermissionAllowed', () => {
    test('should check if permission is allowed for strict level', () => {
      expect(isPermissionAllowed('dom.read', 'strict')).toBe(true);
      expect(isPermissionAllowed('form.collect', 'strict')).toBe(false);
    });

    test('should check if permission is allowed for balanced level', () => {
      expect(isPermissionAllowed('dom.read', 'balanced')).toBe(true);
      expect(isPermissionAllowed('form.collect', 'balanced')).toBe(true);
    });

    test('should check if permission is allowed for permissive level', () => {
      expect(isPermissionAllowed('dom.read', 'permissive')).toBe(true);
      expect(isPermissionAllowed('form.collect', 'permissive')).toBe(true);
    });
  });

  describe('Constants', () => {
    test('PII_PATTERNS should contain regex patterns', () => {
      expect(PII_PATTERNS.EMAIL).toBeInstanceOf(RegExp);
      expect(PII_PATTERNS.PHONE).toBeInstanceOf(RegExp);
      expect(PII_PATTERNS.SSN).toBeInstanceOf(RegExp);
      expect(PII_PATTERNS.CREDIT_CARD).toBeInstanceOf(RegExp);
    });

    test('SENSITIVE_SELECTORS should be an array of strings', () => {
      expect(Array.isArray(SENSITIVE_SELECTORS)).toBe(true);
      expect(SENSITIVE_SELECTORS.length).toBeGreaterThan(0);
      expect(typeof SENSITIVE_SELECTORS[0]).toBe('string');
    });

    test('DEFAULT_PRIVACY_SETTINGS should have three levels', () => {
      expect(DEFAULT_PRIVACY_SETTINGS).toHaveProperty('strict');
      expect(DEFAULT_PRIVACY_SETTINGS).toHaveProperty('balanced');
      expect(DEFAULT_PRIVACY_SETTINGS).toHaveProperty('permissive');
    });
  });
});
