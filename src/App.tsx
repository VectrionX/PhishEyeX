import { useState } from 'react';
import { analyzeMessage, type LocalAnalysis } from './engine/analyze-message';
import { MAX_MESSAGE_BYTES, validateMessage } from './engine/input';
import './styles.css';

const emptyLabel = 'Not present in this message.';
const statusClass = (status: string) => `status status-${status}`;

function ResultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="panel"><h2>{title}</h2>{children}</section>;
}

function Results({ result }: { result: LocalAnalysis }) {
  return <div className="results" aria-label="Analysis results">
    <div className="notice"><strong>Local-only analysis.</strong> Results are derived solely from the pasted text. No reputation lookup, verdict, sandbox, or attachment processing is performed.</div>
    <ResultSection title="Headers">
      <dl className="details">
        <dt>From</dt><dd>{result.headers.from ?? emptyLabel}</dd>
        <dt>Return-Path</dt><dd>{result.headers.returnPath ?? emptyLabel}</dd>
        <dt>Subject</dt><dd>{result.headers.subject ?? emptyLabel}</dd>
      </dl>
    </ResultSection>
    <div className="two-column">
      <ResultSection title="Authentication">
        <div className="status-grid">{Object.entries(result.authentication).map(([name, status]) => <div className="status-row" key={name}><span>{name.toUpperCase()}</span><b className={statusClass(status)}>{status}</b></div>)}</div>
      </ResultSection>
      <ResultSection title="Observations">
        {result.observations.length ? <ul>{result.observations.map(item => <li key={item.id}><strong>{item.title}</strong><br /><span>{item.evidence}</span></li>)}</ul> : <p className="muted">No deterministic observations matched.</p>}
      </ResultSection>
    </div>
    <div className="two-column">
      <ResultSection title={`URLs (${result.urls.length})`}>
        {result.urls.length ? <ul className="mono-list">{result.urls.map(url => <li key={url}>{url}</li>)}</ul> : <p className="muted">No HTTP(S) URLs found.</p>}
      </ResultSection>
      <ResultSection title={`IPv4 addresses (${result.ips.length})`}>
        {result.ips.length ? <ul className="mono-list">{result.ips.map(ip => <li key={ip}>{ip}</li>)}</ul> : <p className="muted">No IPv4 addresses found.</p>}
      </ResultSection>
    </div>
  </div>;
}

export default function App() {
  const [source, setSource] = useState('');
  const [result, setResult] = useState<LocalAnalysis | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    const validation = validateMessage(source);
    if (validation.ok === false) { setError(validation.error); setResult(null); return; }
    setError(''); setLoading(true); setResult(null);
    await new Promise(resolve => setTimeout(resolve, 120));
    try { setResult(analyzeMessage(source)); } catch { setError('The message could not be parsed locally.'); }
    finally { setLoading(false); }
  }

  function clear() { setSource(''); setResult(null); setError(''); }
  const size = new TextEncoder().encode(source).byteLength;

  return <main className="app-shell">
    <header><div><p className="eyebrow">PHISHEY<span>EX</span></p><h1>Deterministic email triage</h1></div><div className="local-badge">● LOCAL ONLY</div></header>
    {!result && <section className="intake panel">
      <div className="intro"><h2>Inspect a message safely</h2><p>Paste raw email headers or message text. Processing stays in this browser and uses fixed extraction rules.</p></div>
      <label htmlFor="message">Email message</label>
      <textarea id="message" value={source} onChange={event => setSource(event.target.value)} placeholder={'From: sender@example.org\nAuthentication-Results: spf=pass; dkim=none; dmarc=pass\n\nMessage body...'} spellCheck={false} />
      <div className="input-meta"><span>{size.toLocaleString()} / {(MAX_MESSAGE_BYTES / 1024).toLocaleString()} KiB limit</span><span>Text only · no files</span></div>
      {error && <div className="error" role="alert">{error}</div>}
      <button onClick={runAnalysis} disabled={loading}>{loading ? 'Analyzing locally…' : 'Analyze message'}</button>
      <p className="limitation">This tool reports observable headers, authentication tokens, URLs, IPv4 addresses, and simple mismatches. It does not determine intent or maliciousness.</p>
    </section>}
    {loading && <div className="loading" role="status">Parsing locally…</div>}
    {result && <><div className="result-head"><div><p className="eyebrow">ANALYSIS COMPLETE</p><h2>Observable evidence</h2></div><button className="secondary" onClick={clear}>New message</button></div><Results result={result} /></>}
  </main>;
}
