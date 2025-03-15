# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of the Model Context Protocol seriously. If you believe you have found a security vulnerability, please follow these steps:

1. **DO NOT** open a public issue
2. Send a description of the vulnerability to security@example.com
3. Include steps to reproduce the vulnerability
4. Include the version of the extension where you found the vulnerability
5. If known, include suggestions for fixing the vulnerability

You should receive a response within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity.

## Security Measures

The MCP extension implements several security measures:

### Content Security Policy

The extension uses a strict Content Security Policy to prevent XSS attacks and other injection vulnerabilities.

### Data Privacy

- All sensitive data is encrypted before storage
- PII is redacted by default
- Data is never sent to third-party servers without explicit user consent

### Authentication & Authorization

- All API requests require authentication
- Access tokens are securely stored
- Regular security audits are performed

### Input Validation

- All user input is sanitized
- API requests are rate-limited
- Input length and format restrictions are enforced

## Best Practices

When contributing to the project, please follow these security best practices:

1. Never store sensitive information in code or comments
2. Always validate and sanitize user input
3. Use secure communication protocols (HTTPS)
4. Follow the principle of least privilege
5. Keep dependencies up to date
6. Use strong encryption for sensitive data
7. Implement proper error handling without exposing sensitive information

## Security Updates

Security updates will be released as patch versions. Users are strongly encouraged to keep their extensions up to date.
