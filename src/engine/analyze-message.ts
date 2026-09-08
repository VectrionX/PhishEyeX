export type AuthenticationStatus = 'pass' | 'fail' | 'none' | 'unknown';

export interface Observation {
  id: 'auth-spf-fail' | 'auth-dkim-fail' | 'auth-dmarc-fail' | 'from-return-path-mismatch';
  title: string;
  evidence: string;
  confidence: 'high';
}

export interface LocalAnalysis {
  headers: { from?: string; returnPath?: string; subject?: string };
  authentication: { spf: AuthenticationStatus; dkim: AuthenticationStatus; dmarc: AuthenticationStatus };
  urls: string[];
  ips: string[];
  observations: Observation[];
}

const header = (source: string, name: string) => source.match(new RegExp(`^${name}:\\s*(.+)$`, 'im'))?.[1]?.trim();
const authentication = (source: string, name: string): AuthenticationStatus => {
  const match = source.match(new RegExp(`\\b${name}=(pass|fail|none|neutral|softfail|temperror|permerror)\\b`, 'i'))?.[1]?.toLowerCase();
  if (match === 'pass') return 'pass';
  if (match === 'fail' || match === 'softfail' || match === 'temperror' || match === 'permerror') return 'fail';
  return match === 'none' || match === 'neutral' ? 'none' : 'unknown';
};
const addressDomain = (value?: string) => value?.match(/@([^>\s]+)/)?.[1]?.toLowerCase();

export function analyzeMessage(source: string): LocalAnalysis {
  const from = header(source, 'From');
  const returnPath = header(source, 'Return-Path');
  const subject = header(source, 'Subject');
  const auth = { spf: authentication(source, 'spf'), dkim: authentication(source, 'dkim'), dmarc: authentication(source, 'dmarc') };
  const urls = [...new Set(source.match(/https?:\/\/[^\s<>'"`]+/gi) ?? [])];
  const ips = [...new Set(source.match(/\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g) ?? [])];
  const observations: Observation[] = [];
  for (const [name, status] of Object.entries(auth) as [keyof typeof auth, AuthenticationStatus][]) {
    if (status === 'fail') observations.push({ id: `auth-${name}-fail`, title: `${name.toUpperCase()} reports failure`, evidence: `Authentication-Results contains ${name}=fail or an error state.`, confidence: 'high' });
  }
  const fromDomain = addressDomain(from), returnDomain = addressDomain(returnPath);
  if (fromDomain && returnDomain && fromDomain !== returnDomain) observations.push({ id: 'from-return-path-mismatch', title: 'From and return-path domains differ', evidence: `From uses ${fromDomain}; Return-Path uses ${returnDomain}.`, confidence: 'high' });
  return { headers: { from, returnPath, subject }, authentication: auth, urls, ips, observations };
}
