import React from 'react';
import './SmartReplies.css';

/**
 * Smart reply suggestion chips — uses the active adapter, zero provider logic.
 */
export default function SmartReplies({ suggestions, loading, providerName, onSelect }) {
  if (!loading && suggestions.length === 0) return null;

  return (
    <div className="smart-replies">
      <span className="sr-label">Quick replies</span>
      {loading ? (
        <span className="sr-loading">
          <span className="sr-dot" />
          <span className="sr-dot" />
          <span className="sr-dot" />
        </span>
      ) : (
        suggestions.map((s) => (
          <button
            key={s.id}
            className="sr-chip"
            onClick={() => onSelect(s.text)}
            title={`Confidence: ${Math.round(s.confidence * 100)}%`}
          >
            {s.text}
          </button>
        ))
      )}
      <span className="sr-badge">{providerName}</span>
    </div>
  );
}
