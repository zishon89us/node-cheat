import { describe, expect, it } from 'vitest';
import { summarize } from '../scanner/engine.js';
import type { SecurityFinding, Severity } from '../types/index.js';
import { checkConclusion, parseRepoUrl } from './client.js';

describe('parseRepoUrl', () => {
  it.each([
    ['https://github.com/octo/hello', 'octo', 'hello'],
    ['https://github.com/octo/hello.git', 'octo', 'hello'],
    ['https://github.com/octo/hello/tree/main/src', 'octo', 'hello'],
    ['https://www.github.com/octo/hello/', 'octo', 'hello'],
    ['octo/hello-world.js', 'octo', 'hello-world.js'],
    ['  octo/hello  ', 'octo', 'hello'],
  ])('parses %s', (input, owner, repo) => {
    expect(parseRepoUrl(input)).toEqual({ owner, repo });
  });

  it.each([
    'https://gitlab.com/octo/hello',
    'https://github.com.evil.example/octo/hello',
    'https://github.com/octo',
    'octo',
    'octo/hello/extra',
    'octo/hel lo',
    'octo/..',
    '../../etc/passwd',
  ])('rejects %s', input => {
    expect(() => parseRepoUrl(input)).toThrow();
  });
});

describe('checkConclusion', () => {
  const withSeverity = (s: Severity) =>
    summarize('r', 1, [{ id: s, severity: s } as SecurityFinding]);

  it('fails on critical and high findings', () => {
    expect(checkConclusion(withSeverity('critical'))).toBe('failure');
    expect(checkConclusion(withSeverity('high'))).toBe('failure');
  });

  it('is neutral on medium and low findings', () => {
    expect(checkConclusion(withSeverity('medium'))).toBe('neutral');
    expect(checkConclusion(withSeverity('low'))).toBe('neutral');
  });

  it('succeeds with no findings', () => {
    expect(checkConclusion(summarize('r', 1, []))).toBe('success');
  });
});
