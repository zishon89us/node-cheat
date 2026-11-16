import type Anthropic from '@anthropic-ai/sdk';
import { describe, expect, it, vi } from 'vitest';
import type { SecurityFinding } from '../types/index.js';
import { ClaudeTriage } from './claude.js';

const finding = (id: string): SecurityFinding => ({
  id,
  ruleId: 'eval-usage',
  severity: 'high',
  category: 'Code Injection',
  title: 'eval',
  description: 'eval',
  file: 'a.js',
  line: 1,
  column: 1,
  code: 'eval(x)',
  context: 'eval(x)',
  recommendation: 'no eval',
});

function fakeClient(byId: Record<string, unknown>) {
  const parse = vi.fn(async (params: { messages: { content: string }[] }) => {
    const id = Object.keys(byId).find(k => params.messages[0].content.includes(`File: ${k}`)) ?? '';
    const out = byId[id];
    if (out instanceof Error) throw out;
    return out;
  });
  return { client: { beta: { messages: { parse } } } as unknown as Anthropic, parse };
}

describe('ClaudeTriage', () => {
  it('drops confident false positives, keeps the rest, and fails open on errors', async () => {
    const { client, parse } = fakeClient({
      'fp.js': {
        stop_reason: 'end_turn',
        parsed_output: { verdict: 'false_positive', confidence: 0.95, explanation: 'test fixture' },
      },
      'unsure.js': {
        stop_reason: 'end_turn',
        parsed_output: { verdict: 'false_positive', confidence: 0.4, explanation: 'maybe' },
      },
      'tp.js': {
        stop_reason: 'end_turn',
        parsed_output: { verdict: 'true_positive', confidence: 1.7, explanation: 'real' },
      },
      'refused.js': { stop_reason: 'refusal', parsed_output: null },
      'err.js': new Error('boom'),
    });
    const triage = new ClaudeTriage(
      { apiKey: 'k', model: 'claude-sonnet-5-5', maxFindings: 10 },
      client
    );
    const input = ['fp.js', 'unsure.js', 'tp.js', 'refused.js', 'err.js'].map(file => ({
      ...finding(file),
      file,
    }));
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const out = await triage.filter(input);

    expect(out.map(f => f.file)).toEqual(['unsure.js', 'tp.js', 'refused.js', 'err.js']);
    expect(out.find(f => f.file === 'tp.js')?.ai?.confidence).toBe(1);
    expect(out.find(f => f.file === 'refused.js')?.ai).toBeUndefined();
    expect(parse).toHaveBeenCalledTimes(5);
    expect(parse.mock.calls[0][0]).toMatchObject({
      model: 'claude-sonnet-5-5',
      fallbacks: 'default',
    });
  });

  it('passes findings beyond maxFindings through without calling the API', async () => {
    const { client, parse } = fakeClient({});
    const triage = new ClaudeTriage({ apiKey: 'k', model: 'm', maxFindings: 0 }, client);
    const out = await triage.filter([finding('a'), finding('b')]);
    expect(out).toHaveLength(2);
    expect(parse).not.toHaveBeenCalled();
  });
});
