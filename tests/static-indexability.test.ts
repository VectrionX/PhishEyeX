import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');

describe('PhishEyeX rebuild-gated crawler policy', () => {
  it('marks the static root as unavailable to crawlers', () => {
    expect(html).toContain('<meta name="robots" content="noindex, nofollow">');
    expect(readFileSync(resolve(root, 'public/robots.txt'), 'utf8')).toContain('Disallow: /');
  });

  it('does not publish a sitemap while rebuild-gated', () => {
    expect(existsSync(resolve(root, 'public/sitemap.xml'))).toBe(false);
  });
});
