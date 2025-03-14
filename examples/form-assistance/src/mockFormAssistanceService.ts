import { Context } from '@mcp/core';

export interface FieldAssistanceRequest {
  context: Context;
  fieldId: string;
  fieldType: string;
  fieldName: string;
  fieldValue: string;
  options?: {
    assistanceType?: 'suggestion' | 'help' | 'validation';
  };
}

export interface FieldAssistanceResponse {
  assistance: string;
  suggestions?: string[];
  isValid?: boolean;
  validationMessage?: string;
  metadata: {
    processingTime: number;
    confidence: number;
    fieldType: string;
  };
}

export interface FormValidationRequest {
  context: Context;
  fieldId: string;
  fieldType: string;
  fieldName: string;
  fieldValue: string;
}

export interface FormValidationResponse {
  isValid: boolean;
  message: string;
  metadata: {
    processingTime: number;
    confidence: number;
    validationRules: string[];
  };
}

export interface FormHelpRequest {
  context: Context;
  options?: {
    section?: string;
  };
}

export interface FormHelpResponse {
  generalHelp: string;
  fieldSpecificHelp?: Record<string, string>;
  metadata: {
    processingTime: number;
    confidence: number;
  };
}

// Field-specific assistance messages
const FIELD_ASSISTANCE: Record<
  string,
  {
    help: string;
    suggestions: string[];
    validationRules: string[];
  }
> = {
  fullName: {
    help: 'Enter your full legal name as it appears on official documents.',
    suggestions: ['John Smith', 'Jane Doe', 'Robert Johnson'],
    validationRules: ['Must contain at least 2 words', 'No special characters allowed'],
  },
  email: {
    help: "Enter a valid email address that you have access to. We'll send a verification email to this address.",
    suggestions: ['example@gmail.com', 'user@company.com', 'name@domain.org'],
    validationRules: ['Must be a valid email format', 'Must contain @ and a domain'],
  },
  phone: {
    help: 'Enter your phone number including country code if applicable.',
    suggestions: ['+1 (555) 123-4567', '555-123-4567', '(555) 123-4567'],
    validationRules: ['Must contain only numbers, spaces, and these special characters: +()-'],
  },
  birthdate: {
    help: 'Enter your date of birth in the format MM/DD/YYYY or use the date picker.',
    suggestions: [],
    validationRules: [
      'Must be a valid date',
      'Must be in the past',
      'Must be at least 18 years ago for adult accounts',
    ],
  },
  username: {
    help: 'Choose a unique username that will identify you on our platform.',
    suggestions: ['user123', 'john_smith', 'jane.doe'],
    validationRules: [
      'Must be 3-20 characters long',
      'Can contain letters, numbers, and these special characters: _.-',
      'Must be unique',
    ],
  },
  password: {
    help: 'Create a strong password that includes a mix of letters, numbers, and special characters.',
    suggestions: [],
    validationRules: [
      'Must be at least 8 characters long',
      'Must include at least one uppercase letter',
      'Must include at least one number',
      'Must include at least one special character',
    ],
  },
  confirmPassword: {
    help: 'Re-enter your password to confirm it was typed correctly.',
    suggestions: [],
    validationRules: ['Must match the password field exactly'],
  },
  streetAddress: {
    help: 'Enter your street address including house/apartment number and street name.',
    suggestions: ['123 Main St', '456 Elm St Apt 7B', '789 Broadway'],
    validationRules: ['Should include number and street name'],
  },
  city: {
    help: 'Enter the name of your city or town.',
    suggestions: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    validationRules: ['Should contain only letters, spaces, and hyphens'],
  },
  state: {
    help: 'Select your state or province from the dropdown list.',
    suggestions: [],
    validationRules: ['Must select a value if country is US or CA'],
  },
  zipCode: {
    help: 'Enter your postal or ZIP code.',
    suggestions: ['12345', '12345-6789', 'A1B 2C3'],
    validationRules: [
      'Format depends on country',
      'US: 5 digits or 5+4 format',
      'Canada: A1A 1A1 format',
    ],
  },
  country: {
    help: 'Select your country from the dropdown list.',
    suggestions: [],
    validationRules: ['Must select a value'],
  },
  communication: {
    help: 'Select how you would like to receive updates and notifications from us.',
    suggestions: [],
    validationRules: ['At least one option recommended'],
  },
  interests: {
    help: 'Select topics that interest you so we can personalize your experience.',
    suggestions: [],
    validationRules: ['Optional'],
  },
  termsAgreement: {
    help: 'You must agree to our Terms and Conditions to create an account.',
    suggestions: [],
    validationRules: ['Must be checked to submit the form'],
  },
};

// Section-specific help messages
const SECTION_HELP: Record<string, string> = {
  personal:
    'The Personal Information section collects basic details about you. Your name and email are required for account creation and communication.',
  account:
    'The Account Information section is where you create your login credentials. Choose a unique username and a strong password to secure your account.',
  address:
    'The Address section collects your location information. This is used for shipping, billing, or location-based services.',
  preferences:
    'The Preferences section allows you to customize your experience. Select your communication preferences and interests.',
  terms:
    'You must agree to our Terms and Conditions before creating an account. Please review them carefully.',
};

// General form help
const GENERAL_FORM_HELP =
  'This registration form collects information needed to create your account. Fields marked with * are required. Your information is protected according to our Privacy Policy.';

/**
 * Simulates an AI service that provides assistance for form fields
 */
export async function getFieldAssistance(
  request: FieldAssistanceRequest
): Promise<FieldAssistanceResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const { fieldId, fieldType, fieldName, fieldValue, options = {} } = request;
  const { assistanceType = 'help' } = options;

  // Get field assistance data
  const fieldKey = fieldId as keyof typeof FIELD_ASSISTANCE;
  const fieldData = FIELD_ASSISTANCE[fieldKey] || {
    help: `Enter your ${fieldName || fieldId}.`,
    suggestions: [],
    validationRules: [],
  };

  // Generate response based on assistance type
  let assistance = '';
  let suggestions: string[] = [];
  let isValid: boolean | undefined = undefined;
  let validationMessage: string | undefined = undefined;

  switch (assistanceType) {
    case 'suggestion':
      assistance = fieldData.help;
      suggestions = fieldData.suggestions;
      break;
    case 'validation':
      isValid = validateField(fieldId, fieldType, fieldValue);
      validationMessage = isValid
        ? `Your ${fieldName || fieldId} looks good!`
        : `Please check your ${fieldName || fieldId}. ${getValidationMessage(
            fieldId,
            fieldType,
            fieldValue
          )}`;
      assistance = fieldData.help;
      break;
    case 'help':
    default:
      assistance = fieldData.help;
      if (fieldData.validationRules.length > 0) {
        assistance += ' Requirements: ' + fieldData.validationRules.join(', ').toLowerCase() + '.';
      }
      break;
  }

  return {
    assistance,
    suggestions,
    isValid,
    validationMessage,
    metadata: {
      processingTime: Math.floor(Math.random() * 200) + 50, // Random processing time between 50-250ms
      confidence: 0.8 + Math.random() * 0.15, // Random confidence between 0.8-0.95
      fieldType,
    },
  };
}

/**
 * Simulates an AI service that validates form fields
 */
export async function validateFormField(
  request: FormValidationRequest
): Promise<FormValidationResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const { fieldId, fieldType, fieldName, fieldValue } = request;

  // Validate the field
  const isValid = validateField(fieldId, fieldType, fieldValue);
  const message = isValid
    ? `Your ${fieldName || fieldId} is valid.`
    : getValidationMessage(fieldId, fieldType, fieldValue);

  // Get validation rules
  const fieldKey = fieldId as keyof typeof FIELD_ASSISTANCE;
  const validationRules = FIELD_ASSISTANCE[fieldKey]?.validationRules || [];

  return {
    isValid,
    message,
    metadata: {
      processingTime: Math.floor(Math.random() * 150) + 50, // Random processing time between 50-200ms
      confidence: 0.85 + Math.random() * 0.1, // Random confidence between 0.85-0.95
      validationRules,
    },
  };
}

/**
 * Simulates an AI service that provides general form help
 */
export async function getFormHelp(request: FormHelpRequest): Promise<FormHelpResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { options = {} } = request;
  const { section } = options;

  // Generate response
  let generalHelp = GENERAL_FORM_HELP;

  if (section && SECTION_HELP[section]) {
    generalHelp = SECTION_HELP[section];
  }

  // Generate field-specific help for common fields
  const fieldSpecificHelp: Record<string, string> = {};

  // Add help for required fields
  fieldSpecificHelp.fullName = FIELD_ASSISTANCE.fullName.help;
  fieldSpecificHelp.email = FIELD_ASSISTANCE.email.help;
  fieldSpecificHelp.username = FIELD_ASSISTANCE.username.help;
  fieldSpecificHelp.password = FIELD_ASSISTANCE.password.help;

  return {
    generalHelp,
    fieldSpecificHelp,
    metadata: {
      processingTime: Math.floor(Math.random() * 300) + 100, // Random processing time between 100-400ms
      confidence: 0.9 + Math.random() * 0.05, // Random confidence between 0.9-0.95
    },
  };
}

/**
 * Validates a field based on its ID and value
 */
function validateField(fieldId: string, fieldType: string, value: string): boolean {
  if (!value && fieldId !== 'termsAgreement') {
    // Empty non-checkbox fields are considered invalid for this demo
    // In a real app, we would check if the field is required
    return false;
  }

  switch (fieldId) {
    case 'fullName':
      return /^[A-Za-z]+(?: [A-Za-z]+)+$/.test(value); // At least first and last name
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Basic email validation
    case 'phone':
      return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/.test(value); // Basic phone validation
    case 'username':
      return /^[a-zA-Z0-9._-]{3,20}$/.test(value); // 3-20 chars, letters, numbers, ._-
    case 'password':
      return (
        value.length >= 8 && // At least 8 chars
        /[A-Z]/.test(value) && // At least one uppercase
        /[0-9]/.test(value) && // At least one number
        /[^A-Za-z0-9]/.test(value)
      ); // At least one special char
    case 'confirmPassword':
      // In a real app, we would compare with the password field
      return value.length >= 8;
    case 'zipCode':
      return (
        /^\d{5}(-\d{4})?$/.test(value) || // US format
        /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(value)
      ); // Canadian format
    case 'termsAgreement':
      return value === 'true' || value === 'on' || value === 'checked';
    default:
      // Basic validation for other fields
      return value.length > 0;
  }
}

/**
 * Gets a validation message for a field
 */
function getValidationMessage(fieldId: string, fieldType: string, value: string): string {
  if (!value && fieldId !== 'termsAgreement') {
    return 'This field is required.';
  }

  switch (fieldId) {
    case 'fullName':
      return 'Please enter your full name (first and last name).';
    case 'email':
      return 'Please enter a valid email address (e.g., example@domain.com).';
    case 'phone':
      return 'Please enter a valid phone number.';
    case 'username':
      return 'Username must be 3-20 characters and can contain letters, numbers, and the characters ._-';
    case 'password':
      return 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
    case 'confirmPassword':
      return 'Passwords do not match.';
    case 'zipCode':
      return 'Please enter a valid postal/ZIP code.';
    case 'termsAgreement':
      return 'You must agree to the Terms and Conditions.';
    default:
      return 'Please check this field.';
  }
}
