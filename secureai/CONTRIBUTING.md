# Contributing to SecureAI

Thank you for your interest in contributing to SecureAI! 🎉

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/zishon89us/node-cheat/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node version, OS, etc.)

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and why it would be useful
3. Include examples if possible

### Adding New Security Rules

Security rules are defined in `src/scanner/rules.ts`. To add a new rule:

```typescript
{
  id: 'unique-rule-id',
  name: 'Descriptive Rule Name',
  severity: 'critical' | 'high' | 'medium' | 'low',
  category: 'Category Name',
  description: 'What this rule detects',
  pattern: /your-regex-pattern/gi,
  validate: (match, fileContent, filePath) => {
    // Optional: custom validation logic
    return true; // true = report finding, false = ignore
  },
  getMessage: (match) => `Description of what was found`,
  getRecommendation: () => 'How to fix the issue',
  cwe: 'CWE-XXX', // Optional: Common Weakness Enumeration
  references: ['https://...'], // Optional: helpful links
}
```

**Rule Guidelines:**
- Use specific, accurate regex patterns
- Include validation to reduce false positives
- Assign appropriate severity levels
- Provide actionable recommendations
- Reference CWE when applicable
- Test thoroughly with real-world code

### Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**:
   - Write clear, commented code
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed
4. **Test your changes**:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```
5. **Commit with clear messages**:
   ```bash
   git commit -m "Add: new security rule for detecting X"
   ```
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

### PR Checklist

- [ ] Code follows existing style and conventions
- [ ] Tests added/updated and passing
- [ ] Documentation updated (README, SETUP, etc.)
- [ ] No new linting errors
- [ ] TypeScript compiles without errors
- [ ] Tested manually with real repositories
- [ ] PR description explains what and why

### Code Style

We use:
- **TypeScript** with strict mode
- **ESLint** for linting
- **Prettier** for formatting
- **Conventional naming**: camelCase for functions, PascalCase for classes

Format code before committing:
```bash
npm run format
npm run lint
```

### Testing

All security rules should have tests in `src/scanner/engine.test.ts`:

```typescript
it('should detect your new vulnerability', async () => {
  const files: GitHubFile[] = [{
    path: 'test.js',
    content: 'vulnerable code here',
    sha: 'abc123',
  }];

  const result = await scanner.scanFiles(files, 'test-repo');

  expect(result.findings.some(f => f.id.includes('your-rule-id'))).toBe(true);
});
```

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/node-cheat.git
cd node-cheat/secureai

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

### Documentation

Update documentation when adding features:
- **README.md**: User-facing features
- **SETUP.md**: Setup/configuration changes
- **Code comments**: Complex logic
- **JSDoc**: Public APIs

### Questions?

Feel free to:
- Open an issue for questions
- Start a discussion
- Reach out to maintainers

---

## Code of Conduct

Be respectful, inclusive, and professional. We're here to build great security tools together!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
