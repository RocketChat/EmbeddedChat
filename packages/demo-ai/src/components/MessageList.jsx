import React, { useEffect, useRef } from 'react';
import './MessageList.css';

function formatTime(ts) {
  const d = ts instanceof Date ? ts : new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const SENTIMENT_ICON = {
  positive: '↑',
  neutral: '·',
  negative: '↓',
};

const CATEGORY_ICON = {
  question: '?',
  statement: '—',
  request: '→',
  greeting: '⌂',
  other: '·',
};

export default function MessageList({ messages, currentUsername }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((msg) => {
        const isMine = msg.u.username === currentUsername;
        return (
          <div key={msg._id} className={`message-row ${isMine ? 'mine' : ''}`}>
            {!isMine && (
              <div className="avatar" title={msg.u.name ?? msg.u.username}>
                {(msg.u.name ?? msg.u.username)[0].toUpperCase()}
              </div>
            )}
            <div className="message-content">
              {!isMine && (
                <div className="message-meta">
                  <span className="message-author">{msg.u.name ?? msg.u.username}</span>
                  <span className="message-time">{formatTime(msg.ts)}</span>
                </div>
              )}
              <div className={`bubble ${isMine ? 'bubble-mine' : ''}`}>
                {msg.msg}
                {msg._ai && (
                  <span
                    className="ai-tag"
                    title={`category: ${msg._ai.category} · sentiment: ${msg._ai.sentiment}`}
                  >
                    {CATEGORY_ICON[msg._ai.category] ?? '·'}
                    {SENTIMENT_ICON[msg._ai.sentiment] ?? '·'}
                  </span>
                )}
              </div>
              {isMine && (
                <div className="message-meta right">
                  <span className="message-time">{formatTime(msg.ts)}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
