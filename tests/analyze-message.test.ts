import { describe, expect, it } from 'vitest';
import { analyzeMessage } from '../src/engine/analyze-message';

describe('analyzeMessage', () => {
  it('extracts locally observable headers, URLs, IPs and deterministic flags', () => {
    const result = analyzeMessage(`From: "Payroll" <alerts@payr0ll.example>\nReturn-Path: <bounce@mailer.example>\nAuthentication-Results: mx.example; spf=fail smtp.mailfrom=mailer.example; dkim=none; dmarc=fail\nReceived: from 198.51.100.42 by mx.example\nSubject: Urgent payroll verification\n\nReview https://payr0ll.example/login?ref=1 and http://198.51.100.7/reset`);
    expect(result.headers.from).toBe('"Payroll" <alerts@payr0ll.example>');
    expect(result.authentication).toEqual({ spf: 'fail', dkim: 'none', dmarc: 'fail' });
    expect(result.urls).toEqual(['https://payr0ll.example/login?ref=1', 'http://198.51.100.7/reset']);
    expect(result.ips).toEqual(['198.51.100.42', '198.51.100.7']);
    expect(result.observations.some(item => item.id === 'auth-dmarc-fail')).toBe(true);
    expect(result.observations.some(item => item.id === 'from-return-path-mismatch')).toBe(true);
  });

  it('does not create a verdict, reputation, sandbox result or invented enrichment', () => {
    const result = analyzeMessage('Subject: Hello\n\nNo indicators.');
    expect('verdict' in result).toBe(false);
    expect('reputation' in result).toBe(false);
    expect('sandbox' in result).toBe(false);
    expect(result.observations).toEqual([]);
  });
});
