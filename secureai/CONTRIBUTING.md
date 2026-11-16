# Contributing to SecureAI

Report bugs and suggest features in [the repository's issues](https://github.com/zishon89us/node-cheat/issues). Include the Node.js version and, for false positives or negatives, a minimal code sample.

## Development

```bash
cd secureai
npm ci
npm run dev          # watch mode
npm test             # vitest
npm run lint         # eslint (flat config)
npm run type-check   # tsc --noEmit
npm run build
```

All four checks must pass before a pull request is merged.

## Adding a rule

Rules live in `src/scanner/rules.ts`:

```typescript
{
  id: 'my-rule',
  name: 'Human-readable name',
  severity: 'high',                 // critical | high | medium | low
  category: 'Code Injection',
  pattern: /dangerousCall\s*\(/g,   // must have the g flag; may be an array
  validate: (match, content, filePath) => true, // optional: return false to drop the match
  getMessage: match => 'What was found.',
  recommendation: 'How to fix it.',
  redact: false,                    // true for anything that could contain a secret
  cwe: 'CWE-94',
}
```

Guidelines:

- **Keep patterns linear.** Avoid nested quantifiers and unbounded `.*`. Use bounded classes such as `[^\n]{0,200}`. The "stays fast on adversarial input" test should keep passing; extend it if your pattern has a new shape.
- **Set `redact: true`** on any rule whose match or surrounding lines may contain a credential. Reports are posted publicly on pull requests.
- **Add positive and negative tests** in `src/scanner/engine.test.ts`: at least one sample the rule must flag and one similar-looking safe sample it must not.

```typescript
it('flags dangerousCall but not safeCall', () => {
  expect(ruleIds('a.js', 'dangerousCall(x)')).toContain('my-rule');
  expect(ruleIds('a.js', 'safeCall(x)')).not.toContain('my-rule');
});
```

## Pull requests

Keep changes focused, include tests, and update README.md or SETUP.md when behavior or configuration changes.

## License

Contributions are licensed under the MIT License.
