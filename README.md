# PhishEyeX

PhishEyeX is a privacy-bounded, local-first email triage application. Paste raw email text to inspect only evidence observable in that text.

## What it reports

- `From`, `Return-Path`, and `Subject` headers
- SPF, DKIM, and DMARC tokens from `Authentication-Results`
- Unique HTTP(S) URLs and IPv4 addresses
- Deterministic observations for failed authentication and From/Return-Path domain differences

The application has no network analysis path, reputation service, verdict, confidence score, sandbox, attachment handling, or inferred enrichment. It does not decide whether a message is malicious. A visible 256 KiB UTF-8 input limit is enforced before parsing, and file uploads are intentionally unsupported.

## Run locally

Requires Node.js 18+ and npm.

```sh
npm install
npm run dev
```

Open the local Vite URL shown in the terminal. No API key or environment configuration is needed. All analysis runs in the browser from the pasted text.

## Quality checks

```sh
npm test
npm run typecheck
npm run build
npm run audit
```

CI runs these checks for every push and pull request. The test suite covers the deterministic engine and intake validation; it uses sanitized inline data and stores no message content.

## Safety and privacy

Use sanitized samples where possible. The application intentionally does not upload, persist, execute, decode, or render attachments. Treat the extracted indicators as analyst evidence, not a threat verdict.

See [SECURITY.md](./SECURITY.md) for reporting security issues.
