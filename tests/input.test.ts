import { describe, expect, it } from 'vitest';
import { MAX_MESSAGE_BYTES, validateMessage } from '../src/engine/input';

describe('validateMessage', () => {
  it('rejects an empty message before analysis', () => {
    expect(validateMessage('   ')).toEqual({ ok: false, error: 'Paste an email message before analyzing.' });
  });

  it('rejects messages over the explicit local processing limit', () => {
    const message = 'x'.repeat(MAX_MESSAGE_BYTES + 1);
    expect(validateMessage(message)).toEqual({ ok: false, error: `Message exceeds the ${MAX_MESSAGE_BYTES / 1024} KiB limit.` });
  });

  it('accepts a non-empty message within the limit', () => {
    expect(validateMessage('Subject: hello')).toEqual({ ok: true });
  });
});
