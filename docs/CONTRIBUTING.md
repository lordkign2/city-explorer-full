# Contributing to City Explorer

Thank you for your interest in contributing to City Explorer! We welcome contributions from the community to help improve and expand the platform.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

## How to Contribute

### Reporting Bugs

Before submitting a bug report, please check the existing issues to see if the problem has already been reported.

When submitting a bug report, please include:
1. A clear and descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots or code examples if applicable
6. Your environment details (OS, browser, Node.js version, etc.)

### Suggesting Enhancements

We welcome ideas for new features or improvements to existing functionality. When suggesting an enhancement:

1. Check existing issues to see if it's already been suggested
2. Provide a clear and descriptive title
3. Explain the problem or need the enhancement addresses
4. Describe the proposed solution
5. Include any additional context or screenshots

### Code Contributions

#### Setting Up Your Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/city-explorer.git
   ```
3. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Follow the setup instructions in [setup.md](setup.md)

#### Making Changes

1. Write clean, well-documented code
2. Follow the existing code style and conventions
3. Add tests for new functionality
4. Update documentation as needed
5. Ensure all tests pass before submitting

#### Code Style Guidelines

##### JavaScript/Node.js
- Use ES6+ features where appropriate
- Follow Airbnb JavaScript Style Guide
- Use meaningful variable and function names
- Comment complex logic
- Keep functions small and focused

##### Database Models
- Use consistent naming conventions
- Include appropriate indexes
- Validate data at the model level
- Document model relationships

##### API Endpoints
- Follow RESTful principles
- Use consistent response formats
- Implement proper error handling
- Include API documentation

#### Testing

We use Jest for testing. Before submitting your contribution:

1. Write unit tests for new functionality
2. Ensure all existing tests pass:
   ```bash
   npm test
   ```
3. Write integration tests for API endpoints
4. Test edge cases and error conditions

#### Documentation

Keep documentation up to date with your changes:
- Update README.md if needed
- Add JSDoc comments to new functions
- Update API documentation
- Add or modify markdown documentation in the docs/ folder

#### Commit Messages

Follow conventional commit format:
```
type(scope): brief description

Detailed explanation if necessary

Fixes #123
```

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests or correcting existing tests
- build: Changes that affect the build system or external dependencies
- ci: Changes to our CI configuration files and scripts
- chore: Other changes that don't modify src or test files
- revert: Reverts a previous commit

#### Pull Request Process

1. Ensure your branch is up to date with the main branch:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
2. Squash related commits for a cleaner history
3. Run the full test suite to ensure nothing is broken
4. Submit a pull request with a clear title and description
5. Link to any relevant issues
6. Request review from maintainers

### Review Process

All submissions require review. We strive to review pull requests within 48 hours. During the review process:

1. Automated checks will run (tests, linting, etc.)
2. Maintainers will review the code for quality and correctness
3. Feedback will be provided for any necessary changes
4. Once approved, the PR will be merged

## Development Workflow

### Branching Strategy

We use a feature branching workflow:
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Individual feature branches
- `bugfix/*`: Bug fix branches
- `release/*`: Release preparation branches

### Versioning

We follow Semantic Versioning (SemVer):
- MAJOR version for incompatible API changes
- MINOR version for backward-compatible functionality
- PATCH version for backward-compatible bug fixes

### Release Process

1. Create a release branch from develop
2. Update version numbers
3. Final testing
4. Merge to main
5. Create GitHub release
6. Deploy to production

## Community

### Communication Channels

- GitHub Issues: For bug reports and feature requests
- GitHub Discussions: For general discussion and questions
- Email: For private inquiries (contributors@cityexplorer.com)

### Recognition

Contributors will be recognized in:
- Release notes
- Contributors list
- Social media announcements (for significant contributions)

## Getting Help

If you need help with your contribution:
1. Check the documentation
2. Look at existing code for examples
3. Ask in GitHub Discussions
4. Contact maintainers directly

Thank you for contributing to City Explorer!