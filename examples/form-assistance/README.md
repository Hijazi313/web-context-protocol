# MCP Form Assistance Example

This example demonstrates how the Model Context Protocol (MCP) can be integrated into web forms to provide intelligent, context-aware assistance to users. It showcases real-time field validation, contextual suggestions, and privacy-aware form assistance.

## Features

- **Intelligent Form Assistance**: Get contextual help and suggestions for form fields
- **Real-time Validation**: Validate form fields as you type with AI-powered feedback
- **Privacy Controls**: Adjust privacy levels to control what data is shared with AI services
- **Contextual Suggestions**: Receive intelligent suggestions based on field type and context
- **Form Help**: Get general and field-specific guidance for completing the form

## Implementation Details

This example implements a registration form with multiple sections:

1. **Personal Information**: Name, email, phone, date of birth
2. **Account Information**: Username, password, password confirmation
3. **Address**: Street address, city, state, zip code, country
4. **Preferences**: Communication preferences, interests
5. **Terms and Submission**: Terms agreement, form submission

The application uses MCP to:

- Track user interactions with form fields
- Gather context about the current field and form state
- Provide privacy-aware assistance based on the current context
- Validate form fields with contextual feedback

## Privacy Features

The example includes three privacy levels:

- **Strict**: Form values are not included in context
- **Balanced**: Non-sensitive form values may be included in context
- **Permissive**: Most form values are included in context (except passwords)

Users can switch between privacy levels at any time, and the application clearly indicates the current privacy level and its implications.

## Technical Implementation

The example uses:

- TypeScript for type-safe code
- MCP Core for context management
- MCP Browser for DOM and user interaction tracking
- Mock AI services for field assistance, validation, and help

## Project Structure

```
form-assistance/
├── src/
│   ├── index.html          # Form layout and structure
│   ├── index.ts            # Main application logic
│   ├── styles.css          # Styling for the form and assistance UI
│   └── mockFormAssistanceService.ts  # Mock AI service for form assistance
├── webpack.config.js       # Webpack configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Project dependencies
├── README.md               # This file
└── IMPLEMENTATION_ANALYSIS.md  # Detailed analysis of the implementation
```

## Running the Example

1. Install dependencies:

   ```
   npm install
   ```

2. Start the development server:

   ```
   npm start
   ```

3. Open your browser and navigate to `http://localhost:9000`

## Key Interactions

- **Field Focus**: When focusing on a field, the application provides contextual assistance
- **Field Input**: As you type, the application updates the form state and provides suggestions
- **Field Blur**: When leaving a field, the application validates the input
- **Form Validation**: The "Validate Form" button triggers validation of all required fields
- **Form Submission**: The "Submit" button validates the form and simulates submission
- **Help Request**: The "Get Form Assistance" button provides general form help

## MCP Integration

The example demonstrates several MCP features:

- **Context Gathering**: Using `client.getContext()` to get DOM, user, and app context
- **User Interaction Tracking**: Using `client.addUserInteraction()` to track field focus, input, blur, etc.
- **App State Management**: Using `client.setAppState()` to update the application state
- **Privacy Controls**: Using `client.updateOptions()` to change privacy levels

## Implementation Analysis

For a detailed analysis of the implementation, including architecture, design patterns, scalability considerations, and potential improvements, see the [IMPLEMENTATION_ANALYSIS.md](./IMPLEMENTATION_ANALYSIS.md) file.
