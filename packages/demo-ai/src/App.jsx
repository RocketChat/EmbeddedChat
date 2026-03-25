import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdapterFactory } from '@embeddedchat/ai-adapter';
import ProviderSwitcher from './components/ProviderSwitcher';
import MessageList from './components/MessageList';
import SmartReplies from './components/SmartReplies';
import AdapterPanel from './components/AdapterPanel';
import './App.css';

const SEED_MESSAGES = [
  { _id: '1', msg: 'Hey team, the new build is failing on CI. Anyone looked at it?', u: { _id: 'u1', username: 'alice', name: 'Alice' }, ts: new Date(Date.now() - 600000) },
  { _id: '2', msg: 'Yeah I saw that. Looks like a dependency upgrade broke something in the auth module.', u: { _id: 'u2', username: 'bob', name: 'Bob' }, ts: new Date(Date.now() - 540000) },
  { _id: '3', msg: 'Can you share the error logs? I can take a look.', u: { _id: 'u1', username: 'alice', name: 'Alice' }, ts: new Date(Date.now() - 480000) },
  { _id: '4', msg: 'Sure, posted in #ci-logs. The issue is with the token validation step.', u: { _id: 'u2', username: 'bob', name: 'Bob' }, ts: new Date(Date.now() - 420000) },
];

const PROVIDERS = ['mock', 'openai', 'rocketchat'];
const CURRENT_USER = { _id: 'me', username: 'you', name: 'You' };

function createAdapter(provider) {
  return AdapterFactory.create({
    provider,
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    rocketchatHost: 'http://localhost:3000',
  });
}

export default function App() {
  const [provider, setProvider] = useState('mock');
  const [adapter, setAdapter] = useState(() => createAdapter('mock'));
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [smartReplies, setSmartReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [processedMsg, setProcessedMsg] = useState(null);
  const [log, setLog] = useState([]);
  const inputRef = useRef(null);

  const addLog = useCallback((entry) => {
    setLog((prev) => [{ id: Date.now() + Math.random(), ...entry }, ...prev].slice(0, 20));
  }, []);

  // Fetch smart replies whenever messages or adapter changes.
  // Cancellation flag prevents stale responses from overwriting newer ones.
  useEffect(() => {
    let cancelled = false;

    const lastFromOther = [...messages]
      .reverse()
      .find((m) => m.u.username !== CURRENT_USER.username);

    if (!lastFromOther) return;

    setLoadingReplies(true);
    addLog({ type: 'call', text: `getSmartReplies() → ${adapter.providerName}` });

    adapter
      .getSmartReplies({
        recentMessages: messages.slice(-5),
        currentUsername: CURRENT_USER.username,
      })
      .then((results) => {
        if (cancelled) return;
        setSmartReplies(results);
        setLoadingReplies(false);
        addLog({ type: 'result', text: `Got ${results.length} suggestions` });
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadingReplies(false);
        addLog({ type: 'error', text: `Error: ${err.message}` });
      });

    return () => {
      cancelled = true;
    };
  }, [messages, adapter]); // re-run on every new message or provider switch

  const switchProvider = useCallback((newProvider) => {
    setProvider(newProvider);
    const newAdapter = createAdapter(newProvider);
    setAdapter(newAdapter);
    setSmartReplies([]);
    setSummary('');
    setProcessedMsg(null);
    addLog({ type: 'switch', text: `Switched to ${newAdapter.providerName}` });
  }, [addLog]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    addLog({ type: 'call', text: `processMessage() → ${adapter.providerName}` });
    let processed = null;
    try {
      processed = await adapter.processMessage(text);
      setProcessedMsg(processed);
      addLog({ type: 'result', text: `category=${processed.category} sentiment=${processed.sentiment}` });
    } catch (err) {
      addLog({ type: 'error', text: `processMessage error: ${err.message}` });
    }

    const newMsg = {
      _id: `msg-${Date.now()}`,
      msg: text,
      u: CURRENT_USER,
      ts: new Date(),
      _ai: processed,
    };
    // Setting messages triggers the useEffect above which fetches new suggestions
    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
    setProcessedMsg(null);
  }, [adapter, addLog]);

  const handleSummarize = useCallback(async () => {
    setLoadingSummary(true);
    addLog({ type: 'call', text: `summarizeThread() → ${adapter.providerName}` });
    try {
      const result = await adapter.summarizeThread(messages);
      setSummary(result);
      addLog({ type: 'result', text: 'Summary ready' });
    } catch (err) {
      addLog({ type: 'error', text: `summarizeThread error: ${err.message}` });
    } finally {
      setLoadingSummary(false);
    }
  }, [adapter, messages, addLog]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <div className="app-layout">
      <div className="chat-panel">
        <header className="chat-header">
          <div className="chat-header-left">
            <span className="chat-title"># general</span>
            <span className="chat-subtitle">EmbeddedChat · AI Adapter Demo</span>
          </div>
          <ProviderSwitcher
            providers={PROVIDERS}
            active={provider}
            onChange={switchProvider}
          />
        </header>

        <MessageList messages={messages} currentUsername={CURRENT_USER.username} />

        {summary && (
          <div className="summary-bar">
            <span className="summary-icon">∑</span>
            <span className="summary-text">{summary}</span>
            <button className="summary-close" onClick={() => setSummary('')}>×</button>
          </div>
        )}

        <SmartReplies
          suggestions={smartReplies}
          loading={loadingReplies}
          providerName={adapter.providerName}
          onSelect={(text) => {
            setInputValue(text);
            inputRef.current?.focus();
          }}
        />

        <div className="input-area">
          <textarea
            ref={inputRef}
            className="message-input"
            placeholder="Type a message… (Enter to send)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim()}
          >
            Send
          </button>
        </div>
      </div>

      <AdapterPanel
        adapter={adapter}
        provider={provider}
        log={log}
        processedMsg={processedMsg}
        onSummarize={handleSummarize}
        loadingSummary={loadingSummary}
      />
    </div>
  );
}
