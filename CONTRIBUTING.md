# Contributing to Model Context Protocol

Thank you for your interest in contributing to the Model Context Protocol (MCP)! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

There are many ways to contribute to MCP:

1. **Reporting Bugs**: If you find a bug, please create an issue with a detailed description.
2. **Suggesting Enhancements**: Have ideas for new features? Open an issue with the "enhancement" label.
3. **Pull Requests**: Submit PRs for bug fixes or new features.
4. **Documentation**: Help improve or translate documentation.
5. **Examples**: Create examples showing how to use MCP in different scenarios.

## Development Process

### Setting Up the Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/mcp.git
   cd mcp
   ```
3. Install dependencies:
   ```bash
   npm install
   npx lerna bootstrap
   ```
4. Build the packages:
   ```bash
   npm run build
   ```

### Branching Strategy

- `main`: The primary branch containing the latest stable code
- `develop`: The development branch for integrating features
- Feature branches: Create from `develop` with the format `feature/your-feature-name`
- Bugfix branches: Create from `develop` with the format `bugfix/issue-description`

### Pull Request Process

1. Create a new branch from `develop` for your changes
2. Make your changes and commit them with clear, descriptive messages
3. Push your branch to your fork
4. Submit a pull request to the `develop` branch of the main repository
5. Ensure your PR description clearly describes the changes and references any related issues

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that don't affect the code's meaning (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Changes to the build process or auxiliary tools

Example: `feat(browser): add support for shadow DOM traversal`

## Testing

- Write tests for all new features and bug fixes
- Run tests before submitting a PR:
  ```bash
  npm test
  ```
- Ensure your changes pass linting:
  ```bash
  npm run lint
  ```

## Documentation

- Update documentation to reflect any changes you make
- Document new features, options, and behaviors
- Use clear, concise language and provide examples where appropriate

## Package Structure

When contributing to specific packages, please maintain the existing structure:

- `src/`: Source code
- `tests/`: Test files
- `examples/`: Example usage
- `README.md`: Package-specific documentation

## Releasing

The core team handles releases using the following process:

1. Update version numbers according to [Semantic Versioning](https://semver.org/)
2. Generate changelogs
3. Create a release tag
4. Publish packages to npm

## Questions?

If you have questions about contributing, please open an issue with the "question" label or reach out to the maintainers directly.

Thank you for contributing to the Model Context Protocol!
