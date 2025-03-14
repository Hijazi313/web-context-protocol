import './styles.css';
import { getFieldAssistance, validateFormField, getFormHelp } from './mockFormAssistanceService';
import { createMcpClient, PrivacyLevel } from '@mcp/core';
import { createBrowserContextProvider } from '@mcp/browser';

// DOM Elements
const form = document.getElementById('registration-form') as HTMLFormElement;
const formFields = form.querySelectorAll('input, select, textarea');
const assistanceContainers = document.querySelectorAll('.assistance-container');
const validationContainers = document.querySelectorAll('.validation-container');
const fieldAssistancePanel = document.getElementById('field-assistance') as HTMLDivElement;
const contextDetails = document.getElementById('context-details') as HTMLDivElement;
const validateFormButton = document.getElementById('validate-form') as HTMLButtonElement;
const submitFormButton = document.getElementById('submit-form') as HTMLButtonElement;
const helpButton = document.getElementById('help-button') as HTMLButtonElement;
const privacyLevelSelect = document.getElementById('privacy-level') as HTMLSelectElement;
const currentPrivacyLevel = document.getElementById('current-privacy-level') as HTMLSpanElement;
const privacyDescription = document.getElementById('privacy-description') as HTMLParagraphElement;

// Initialize MCP Client
const provider = createBrowserContextProvider({
  observeDomMutations: true,
  trackUserInteractions: true,
  trackNavigation: false,
  maxDomDepth: 10,
});

const client = createMcpClient({
  privacyLevel: PrivacyLevel.STRICT, // Default to strict for forms
  permissions: ['dom.read', 'user.interaction'],
  scope: 'current-view',
  realTimeUpdates: true,
  maxContextSize: 1024 * 1024, // 1MB
  updateIntervalMs: 300, // More frequent updates for responsive assistance
});

// Initialize the client with the provider
client.initialize(provider);

// State
interface FormState {
  currentField: string | null;
  validatedFields: Set<string>;
  formErrors: Map<string, string>;
  formValues: Record<string, string>;
}

const formState: FormState = {
  currentField: null,
  validatedFields: new Set(),
  formErrors: new Map(),
  formValues: {},
};

// Event Listeners
formFields.forEach(field => {
  field.addEventListener('focus', handleFieldFocus);
  field.addEventListener('input', handleFieldInput);
  field.addEventListener('blur', handleFieldBlur);
});

validateFormButton.addEventListener('click', handleValidateForm);
submitFormButton.addEventListener('click', handleSubmitForm);
helpButton.addEventListener('click', handleHelpRequest);
privacyLevelSelect.addEventListener('change', handlePrivacyLevelChange);
form.addEventListener('submit', handleFormSubmit);

// Initialize the app
initializeApp();

// Functions
function initializeApp() {
  // Update privacy level description
  updatePrivacyLevelDescription(privacyLevelSelect.value as 'strict' | 'balanced' | 'permissive');

  // Set up MCP app state
  client.setAppState({ formState: { hasChanges: false, fieldCount: formFields.length } });

  // Add data attributes to form for MCP to capture
  form.setAttribute('data-form-type', 'registration');
  form.setAttribute('data-required-fields', '5'); // Number of required fields

  // Track form view
  trackFormView();
}

function trackFormView() {
  // Add interaction to MCP context
  client.addUserInteraction({
    type: 'view',
    target: 'registration-form',
    targetType: 'form',
    metadata: {
      formType: 'registration',
      timestamp: Date.now(),
    },
  });

  // Update context details
  updateContextDetails();
}

async function handleFieldFocus(event: Event) {
  const field = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  const fieldId = field.id;
  const fieldName = field.name;
  const fieldType = field.type;

  // Update state
  formState.currentField = fieldId;

  // Track field focus in MCP
  client.addUserInteraction({
    type: 'focus',
    target: fieldId,
    targetType: 'form-field',
    metadata: {
      fieldName,
      fieldType,
      timestamp: Date.now(),
    },
  });

  // Provide field assistance
  await provideFieldAssistance(fieldId);

  // Update context details
  updateContextDetails();
}

async function handleFieldInput(event: Event) {
  const field = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  const fieldId = field.id;
  const fieldValue = getFieldValue(field);

  // Update form values
  formState.formValues[fieldId] = fieldValue;

  // Update app state
  client.setAppState({
    formState: {
      hasChanges: true,
      currentField: fieldId,
      fieldCount: formFields.length,
      completedFields: Object.keys(formState.formValues).length,
    },
  });

  // For password confirmation, validate on input
  if (fieldId === 'confirmPassword' && formState.formValues.password) {
    validateFieldMatch('confirmPassword', 'password');
  }
}

async function handleFieldBlur(event: Event) {
  const field = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  const fieldId = field.id;
  const fieldName = field.name;
  const fieldType = field.type;
  const fieldValue = getFieldValue(field);

  // Track field blur in MCP
  client.addUserInteraction({
    type: 'blur',
    target: fieldId,
    targetType: 'form-field',
    metadata: {
      fieldName,
      fieldType,
      hasValue: !!fieldValue,
      timestamp: Date.now(),
    },
  });

  // Validate field on blur if it has a value or is required
  if (fieldValue || field.hasAttribute('required')) {
    await validateField(fieldId);
  }

  // Clear current field if it's the one being blurred
  if (formState.currentField === fieldId) {
    formState.currentField = null;
  }
}

async function provideFieldAssistance(fieldId: string) {
  const field = document.getElementById(fieldId) as
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;
  if (!field) return;

  const fieldName = field.name || fieldId;
  const fieldType = field.type;
  const fieldValue = getFieldValue(field);

  const assistanceContainer = document.querySelector(`[data-assistance-for="${fieldId}"]`);
  if (!assistanceContainer) return;

  // Show loading state
  assistanceContainer.innerHTML = '<div class="loading-indicator"></div>';
  fieldAssistancePanel.innerHTML = '<div class="loading-indicator"></div>';

  try {
    // Get context using MCP
    const result = await client.getContext({
      includeDOM: true,
      includeUserContext: true,
      includeAppContext: false,
      selector: `#${fieldId}, form`, // Get the field and its form
      maxDepth: 5,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to get context');
    }

    // Call the mock AI service to get field assistance
    const response = await getFieldAssistance({
      context: result.context,
      fieldId,
      fieldType,
      fieldName,
      fieldValue,
      options: {
        assistanceType: 'suggestion',
      },
    });

    // Display the assistance
    displayFieldAssistance(assistanceContainer as HTMLElement, fieldAssistancePanel, response);
  } catch (error) {
    assistanceContainer.innerHTML = `<p class="error">Error: ${
      error instanceof Error ? error.message : 'Unknown error'
    }</p>`;
    fieldAssistancePanel.innerHTML = `<p class="error">Error: ${
      error instanceof Error ? error.message : 'Unknown error'
    }</p>`;
  }
}

function displayFieldAssistance(container: HTMLElement, panel: HTMLElement, response: any) {
  // Display in the field's assistance container
  container.innerHTML = `
    <div class="assistance-message">
      ${response.assistance}
    </div>
  `;

  // Display in the assistance panel
  let panelContent = `
    <h4>${container.parentElement?.querySelector('label')?.textContent || 'Field Assistance'}</h4>
    <p>${response.assistance}</p>
  `;

  if (response.suggestions && response.suggestions.length > 0) {
    panelContent += `
      <div class="suggestions">
        <h5>Suggestions:</h5>
        <ul class="suggestion-list">
          ${response.suggestions
            .map(
              (suggestion: string) => `
            <li class="suggestion-item" data-value="${suggestion}">${suggestion}</li>
          `
            )
            .join('')}
        </ul>
      </div>
    `;
  }

  panel.innerHTML = panelContent;

  // Add click event listeners to suggestions
  const suggestionItems = panel.querySelectorAll('.suggestion-item');
  suggestionItems.forEach(item => {
    item.addEventListener('click', () => {
      const value = item.getAttribute('data-value');
      if (value && formState.currentField) {
        const field = document.getElementById(formState.currentField) as HTMLInputElement;
        if (field) {
          field.value = value;
          // Trigger input event to update state
          field.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    });
  });
}

async function validateField(fieldId: string) {
  const field = document.getElementById(fieldId) as
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;
  if (!field) return;

  const fieldName = field.name || fieldId;
  const fieldType = field.type;
  const fieldValue = getFieldValue(field);

  const validationContainer = document.querySelector(`[data-validation-for="${fieldId}"]`);
  if (!validationContainer) return;

  try {
    // Get context using MCP
    const result = await client.getContext({
      includeDOM: true,
      includeUserContext: false,
      includeAppContext: false,
      selector: `#${fieldId}, form`, // Get the field and its form
      maxDepth: 3,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to get context');
    }

    // Call the mock AI service to validate the field
    const response = await validateFormField({
      context: result.context,
      fieldId,
      fieldType,
      fieldName,
      fieldValue,
    });

    // Display the validation result
    displayValidationResult(field, validationContainer as HTMLElement, response);

    // Update form state
    formState.validatedFields.add(fieldId);
    if (response.isValid) {
      formState.formErrors.delete(fieldId);
    } else {
      formState.formErrors.set(fieldId, response.message);
    }

    return response.isValid;
  } catch (error) {
    validationContainer.innerHTML = `<p class="error">Error: ${
      error instanceof Error ? error.message : 'Unknown error'
    }</p>`;
    return false;
  }
}

function displayValidationResult(
  field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  container: HTMLElement,
  response: any
) {
  // Remove previous validation classes
  field.classList.remove('error', 'success');

  if (response.isValid) {
    // Add success class
    field.classList.add('success');
    container.innerHTML = `
      <div class="validation-success">
        ${response.message}
      </div>
    `;
  } else {
    // Add error class
    field.classList.add('error');
    container.innerHTML = `
      <div class="validation-message">
        ${response.message}
      </div>
    `;
  }
}

function validateFieldMatch(fieldId: string, matchFieldId: string) {
  const field = document.getElementById(fieldId) as HTMLInputElement;
  const matchField = document.getElementById(matchFieldId) as HTMLInputElement;
  const validationContainer = document.querySelector(`[data-validation-for="${fieldId}"]`);

  if (!field || !matchField || !validationContainer) return;

  const isValid = field.value === matchField.value;

  // Remove previous validation classes
  field.classList.remove('error', 'success');

  if (isValid) {
    // Add success class
    field.classList.add('success');
    validationContainer.innerHTML = `
      <div class="validation-success">
        Passwords match.
      </div>
    `;
    formState.formErrors.delete(fieldId);
  } else {
    // Add error class
    field.classList.add('error');
    validationContainer.innerHTML = `
      <div class="validation-message">
        Passwords do not match.
      </div>
    `;
    formState.formErrors.set(fieldId, 'Passwords do not match.');
  }

  formState.validatedFields.add(fieldId);
  return isValid;
}

async function handleValidateForm() {
  // Show loading state
  showNotification('Validating form...');

  // Validate all required fields
  const requiredFields = Array.from(formFields).filter(field => field.hasAttribute('required'));

  let allValid = true;
  for (const field of requiredFields) {
    const isValid = await validateField(field.id);
    if (!isValid) {
      allValid = false;
    }
  }

  // Validate password confirmation if both password fields have values
  if (formState.formValues.password && formState.formValues.confirmPassword) {
    const passwordsMatch = validateFieldMatch('confirmPassword', 'password');
    if (!passwordsMatch) {
      allValid = false;
    }
  }

  // Show result
  if (allValid) {
    showNotification('All required fields are valid!', 'success');
  } else {
    showNotification('Please fix the errors in the form.', 'error');
    // Scroll to first error
    const firstErrorField = document.querySelector('.error') as HTMLElement;
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErrorField.focus();
    }
  }

  // Track validation in MCP
  client.addUserInteraction({
    type: 'validate',
    target: 'registration-form',
    targetType: 'form',
    metadata: {
      isValid: allValid,
      errorCount: formState.formErrors.size,
      timestamp: Date.now(),
    },
  });

  // Update context details
  updateContextDetails();
}

async function handleSubmitForm(event: Event) {
  event.preventDefault();

  // Validate form first
  await handleValidateForm();

  // Check if form is valid
  if (formState.formErrors.size === 0) {
    // Show success message
    showNotification('Form submitted successfully!', 'success');

    // In a real app, we would submit the form data to a server
    console.log('Form data:', formState.formValues);

    // Track submission in MCP
    client.addUserInteraction({
      type: 'submit',
      target: 'registration-form',
      targetType: 'form',
      metadata: {
        success: true,
        timestamp: Date.now(),
      },
    });

    // Reset form
    form.reset();
    formState.formValues = {};
    formState.validatedFields.clear();
    formState.formErrors.clear();

    // Clear validation styles
    formFields.forEach(field => {
      field.classList.remove('error', 'success');
    });

    validationContainers.forEach(container => {
      container.innerHTML = '';
    });
  }
}

async function handleFormSubmit(event: Event) {
  // Prevent default form submission
  event.preventDefault();
}

async function handleHelpRequest() {
  // Show loading state
  fieldAssistancePanel.innerHTML = '<div class="loading-indicator"></div>';

  try {
    // Get context using MCP
    const result = await client.getContext({
      includeDOM: true,
      includeUserContext: true,
      includeAppContext: true,
      selector: 'form',
      maxDepth: 5,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to get context');
    }

    // Call the mock AI service to get form help
    const response = await getFormHelp({
      context: result.context,
    });

    // Display the help
    displayFormHelp(response);

    // Track help request in MCP
    client.addUserInteraction({
      type: 'help',
      target: 'registration-form',
      targetType: 'form',
      metadata: {
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    fieldAssistancePanel.innerHTML = `<p class="error">Error: ${
      error instanceof Error ? error.message : 'Unknown error'
    }</p>`;
  }
}

function displayFormHelp(response: any) {
  let helpContent = `
    <h4>Form Assistance</h4>
    <p>${response.generalHelp}</p>
  `;

  if (response.fieldSpecificHelp) {
    helpContent += `
      <div class="field-specific-help">
        <h5>Field-Specific Help:</h5>
        <ul>
    `;

    for (const [fieldId, help] of Object.entries(response.fieldSpecificHelp)) {
      const field = document.getElementById(fieldId);
      const fieldLabel = field?.parentElement?.querySelector('label')?.textContent || fieldId;

      helpContent += `
        <li>
          <strong>${fieldLabel}:</strong> ${help}
        </li>
      `;
    }

    helpContent += `
        </ul>
      </div>
    `;
  }

  helpContent += `
    <div class="help-metadata">
      <p><small>Processing time: ${response.metadata.processingTime}ms | Confidence: ${(
    response.metadata.confidence * 100
  ).toFixed(0)}%</small></p>
    </div>
  `;

  fieldAssistancePanel.innerHTML = helpContent;
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

  // Show privacy level notification
  showNotification(`Privacy level set to ${level}. ${getPrivacyLevelDescription(level)}`);

  // Update context details
  updateContextDetails();
}

function updatePrivacyLevelDescription(level: 'strict' | 'balanced' | 'permissive') {
  currentPrivacyLevel.textContent = level.charAt(0).toUpperCase() + level.slice(1);
  privacyDescription.textContent = getPrivacyLevelDescription(level);
}

function getPrivacyLevelDescription(level: string): string {
  switch (level) {
    case 'strict':
      return 'Form values will not be included in context.';
    case 'balanced':
      return 'Non-sensitive form values may be included in context.';
    case 'permissive':
      return 'Most form values will be included in context (except passwords).';
    default:
      return '';
  }
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
          formFields: formFields.length,
          validatedFields: formState.validatedFields.size,
          formErrors: formState.formErrors.size,
          interactions: context.user?.interactions?.length || 0,
          executionTime: result.executionTime,
        };

        contextDetails.innerHTML = `
        <p><strong>Timestamp:</strong> ${contextInfo.timestamp}</p>
        <p><strong>Privacy Level:</strong> ${contextInfo.privacyLevel}</p>
        <p><strong>Form Fields:</strong> ${contextInfo.formFields}</p>
        <p><strong>Validated Fields:</strong> ${contextInfo.validatedFields}</p>
        <p><strong>Form Errors:</strong> ${contextInfo.formErrors}</p>
        <p><strong>User Interactions:</strong> ${contextInfo.interactions}</p>
        <p><strong>Execution Time:</strong> ${contextInfo.executionTime}ms</p>
      `;
      }
    });
}

function getFieldValue(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
  if (field.type === 'checkbox') {
    return (field as HTMLInputElement).checked ? 'checked' : '';
  } else {
    return field.value;
  }
}

function showNotification(message: string, type: 'info' | 'success' | 'error' = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
