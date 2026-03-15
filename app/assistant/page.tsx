'use client';

import { useState, useRef, useEffect } from 'react';
import { Navigation } from '@/components/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'What does a high glucose level mean?',
  'How does BMI affect diabetes risk?',
  'What is the Diabetes Pedigree Function?',
  'How accurate is the prediction model?',
  'What lifestyle changes reduce diabetes risk?',
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: 'user', content: trimmed };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const json = await res.json();
      setMessages([...updated, { role: 'assistant', content: json.reply ?? 'Sorry, I could not generate a response.' }]);
    } catch {
      setMessages([...updated, { role: 'assistant', content: 'Unable to reach the AI service. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@400;500;600&display=swap');

        :root {
          --cream: #f7f4ef;
          --ink: #1a1714;
          --ink-soft: #4a4540;
          --ink-faint: #9a948d;
          --rule: #ddd8d0;
          --accent: #c0392b;
          --card-bg: #faf8f5;
        }
        body { background: var(--cream); }

        .chat-root {
          font-family: 'Instrument Sans', sans-serif;
          min-height: 100vh;
          background: var(--cream);
          color: var(--ink);
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          border-bottom: 1px solid var(--rule);
          padding: 48px 0 40px;
          text-align: center;
          position: relative;
        }
        .chat-header::before {
          content: ''; position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 1px; height: 24px; background: var(--rule);
        }
        .chat-eyebrow {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--ink-faint); margin-bottom: 16px;
        }
        .chat-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(26px, 3.5vw, 42px); font-weight: 400;
          color: var(--ink); margin-bottom: 10px; letter-spacing: -0.01em;
        }
        .chat-title em { font-style: italic; color: var(--accent); }
        .chat-subtitle { font-size: 13px; color: var(--ink-faint); }

        .chat-body {
          max-width: 720px;
          width: 100%;
          margin: 0 auto;
          padding: 0 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 32px 0 16px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          min-height: 300px;
          max-height: calc(100vh - 380px);
        }

        .chat-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
          padding: 40px 0;
        }
        .chat-empty-text {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: var(--ink-faint);
          letter-spacing: 0.08em;
          text-align: center;
        }

        .suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          max-width: 520px;
        }
        .suggestion-btn {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.04em;
          padding: 8px 14px;
          border: 1px solid var(--rule);
          background: var(--card-bg);
          color: var(--ink-soft);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .suggestion-btn:hover {
          background: #fff;
          border-color: var(--ink-faint);
        }

        .msg {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .msg-user { justify-content: flex-end; }
        .msg-assistant { justify-content: flex-start; }

        .msg-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-faint);
          flex-shrink: 0;
          padding-top: 4px;
          width: 28px;
        }

        .msg-bubble {
          max-width: 85%;
          padding: 14px 18px;
          font-size: 13px;
          line-height: 1.7;
          color: var(--ink-soft);
        }
        .msg-user .msg-bubble {
          background: var(--ink);
          color: var(--cream);
          border: 1px solid var(--ink);
        }
        .msg-assistant .msg-bubble {
          background: var(--card-bg);
          border: 1px solid var(--rule);
        }

        .msg-typing {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: var(--ink-faint);
          padding: 14px 18px;
          background: var(--card-bg);
          border: 1px solid var(--rule);
        }

        .chat-input-area {
          border-top: 1px solid var(--rule);
          padding: 20px 0 32px;
        }
        .chat-form {
          display: flex;
          gap: 0;
          border: 1px solid var(--rule);
          background: var(--card-bg);
        }
        .chat-input {
          flex: 1;
          padding: 14px 18px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 13px;
          color: var(--ink);
          background: transparent;
          border: none;
          outline: none;
        }
        .chat-input::placeholder {
          color: var(--ink-faint);
        }
        .chat-send {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 14px 20px;
          background: var(--ink);
          color: var(--cream);
          border: none;
          border-left: 1px solid var(--rule);
          cursor: pointer;
          transition: background 0.2s;
        }
        .chat-send:hover:not(:disabled) { background: var(--accent); }
        .chat-send:disabled { opacity: 0.5; cursor: not-allowed; }

        .chat-footer {
          padding: 16px 0 24px;
          border-top: 1px solid var(--rule);
          display: flex;
          justify-content: space-between;
        }
        .chat-footer span {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: var(--ink-faint);
          letter-spacing: 0.08em;
        }
      `}</style>

      <Navigation />

      <main className="chat-root">
        <header className="chat-header">
          <p className="chat-eyebrow">AI-Powered · System-Prompted Health Q&A</p>
          <h1 className="chat-title">Health <em>Assistant</em></h1>
          <p className="chat-subtitle">Ask questions about diabetes, risk factors, and the prediction model</p>
        </header>

        <div className="chat-body">
          <div className="chat-messages" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="chat-empty">
                <p className="chat-empty-text">
                  Ask me anything about diabetes risk factors,<br />
                  clinical indicators, or how the prediction model works.
                </p>
                <div className="suggestions">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      className="suggestion-btn"
                      onClick={() => sendMessage(q)}
                      disabled={loading}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i} className={`msg msg-${msg.role}`}>
                    {msg.role === 'assistant' && <span className="msg-label">AI</span>}
                    <div className="msg-bubble">{msg.content}</div>
                    {msg.role === 'user' && <span className="msg-label">YOU</span>}
                  </div>
                ))}
                {loading && (
                  <div className="msg msg-assistant">
                    <span className="msg-label">AI</span>
                    <div className="msg-typing">Thinking...</div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="chat-input-area">
            <form className="chat-form" onSubmit={handleSubmit}>
              <input
                className="chat-input"
                type="text"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button className="chat-send" type="submit" disabled={loading || !input.trim()}>
                Send →
              </button>
            </form>
          </div>

          <div className="chat-footer">
            <span>GPT-4o-mini · Rule-Based System Prompting</span>
            <span>For informational purposes only</span>
          </div>
        </div>
      </main>
    </>
  );
}
