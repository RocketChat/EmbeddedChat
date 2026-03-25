import React from 'react';
import './AdapterPanel.css';

const LOG_ICONS = {
  switch: '⇄',
  call: '→',
  result: '✓',
  error: '✗',
};

const PROVIDER_COLORS = {
  mock: 'var(--mock-color)',
  openai: 'var(--openai-color)',
  rocketchat: 'var(--rocketchat-color)',
};

/**
 * AdapterPanel — the "wiring diagram" side panel.
 * Shows live API call log, active adapter info, and processedMessage analysis.
 */
export default function AdapterPanel({
  adapter,
  provider,
  log,
  processedMsg,
  onSummarize,
  loadingSummary,
}) {
  const providerColor = PROVIDER_COLORS[provider] ?? 'var(--accent)';

  return (
    <div className="adapter-panel">
      {/* Active adapter card */}
      <div className="panel-section">
        <div className="section-label">Active Adapter</div>
        <div className="adapter-card" style={{ '--card-color': providerColor }}>
          <div className="adapter-card-dot" />
          <div className="adapter-card-body">
            <div className="adapter-name">{adapter.providerName}</div>
            <div className="adapter-key" style={{ color: providerColor }}>
              provider: &quot;{provider}&quot;
            </div>
          </div>
        </div>
        <div className="adapter-contract">
          <div className="contract-title">Interface methods</div>
          <div className="contract-method">getSmartReplies(context)</div>
          <div className="contract-method">summarizeThread(messages)</div>
          <div className="contract-method">processMessage(message)</div>
        </div>
      </div>

      {/* Actions */}
      <div className="panel-section">
        <div className="section-label">Actions</div>
        <button
          className="action-btn"
          onClick={onSummarize}
          disabled={loadingSummary}
        >
          {loadingSummary ? 'Summarizing…' : '∑ Summarize thread'}
        </button>
      </div>

      {/* Last processed message */}
      {processedMsg && (
        <div className="panel-section">
          <div className="section-label">Message Analysis</div>
          <div className="analysis-card">
            <div className="analysis-row">
              <span className="analysis-key">category</span>
              <span className="analysis-val">{processedMsg.category}</span>
            </div>
            <div className="analysis-row">
              <span className="analysis-key">sentiment</span>
              <span
                className="analysis-val"
                data-sentiment={processedMsg.sentiment}
              >
                {processedMsg.sentiment}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Live call log */}
      <div className="panel-section log-section">
        <div className="section-label">Live call log</div>
        <div className="log-list">
          {log.length === 0 && (
            <div className="log-empty">Waiting for API calls…</div>
          )}
          {log.map((entry) => (
            <div key={entry.id} className={`log-entry log-${entry.type}`}>
              <span className="log-icon">{LOG_ICONS[entry.type] ?? '·'}</span>
              <span className="log-text">{entry.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="panel-footer">
        <span className="footer-mono">AdapterFactory.create(&#123; provider: &quot;{provider}&quot; &#125;)</span>
      </div>
    </div>
  );
}
