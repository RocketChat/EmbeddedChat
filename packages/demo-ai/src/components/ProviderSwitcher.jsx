import React from 'react';
import './ProviderSwitcher.css';

const PROVIDER_META = {
  mock: { label: 'Mock AI', color: 'var(--mock-color)', desc: 'Zero setup · context-aware' },
  openai: { label: 'OpenAI', color: 'var(--openai-color)', desc: 'GPT-4o-mini · needs API key' },
  rocketchat: { label: 'RocketChat AI', color: 'var(--rocketchat-color)', desc: 'Stub · extensibility demo' },
};

/**
 * Live provider switcher — the visual proof of pluggability.
 * Changing this dropdown is the ONLY config change needed to switch AI providers.
 */
export default function ProviderSwitcher({ providers, active, onChange }) {
  return (
    <div className="provider-switcher">
      {providers.map((p) => {
        const meta = PROVIDER_META[p] ?? { label: p, color: 'var(--accent)', desc: '' };
        const isActive = p === active;
        return (
          <button
            key={p}
            className={`provider-btn ${isActive ? 'active' : ''}`}
            style={{ '--provider-color': meta.color }}
            onClick={() => onChange(p)}
            title={meta.desc}
          >
            <span className="provider-dot" />
            <span className="provider-label">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
