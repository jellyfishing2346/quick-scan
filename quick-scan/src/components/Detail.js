import { useState, useRef, useEffect } from 'react';
import './Detail.css';

export default function Detail({ doc, activeTab, onTabChange, onClose, chatHistory, onSendChat }) {
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  const msgsRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [chatHistory, sending]);

  async function handleSend() {
    const q = chatInput.trim();
    if (!q || sending) return;
    setChatInput('');
    setSending(true);
    await onSendChat(q);
    setSending(false);
  }

  return (
    <div className="detail">
      <div className="dhead">
        <div className="dtitle" title={doc.name}>{doc.name}</div>
        <button className="dclose" onClick={onClose}>✕</button>
      </div>
      <div className="dtabs">
        {[['sum', 'Summary'], ['txt', 'Text'], ['chat', 'Chat']].map(([tab, label]) => (
          <div
            key={tab}
            className={`dtab${activeTab === tab ? ' active' : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {label}
          </div>
        ))}
      </div>

      {activeTab === 'sum' && (
        <div className="dpanel">
          <span className="ai-badge-detail">AI Summary</span>
          <div className="sum-block">
            <div className="sum-label">Overview</div>
            <div className="sum-text">{doc.summary || 'No summary available.'}</div>
          </div>
          <div className="sum-block">
            <div className="sum-label">Document Details</div>
            <div className="kv-row"><span className="kv-k">Type</span><span className="kv-v">{doc.type}</span></div>
            <div className="kv-row"><span className="kv-k">Year</span><span className="kv-v">{doc.year}</span></div>
            <div className="kv-row"><span className="kv-k">Added</span><span className="kv-v">{doc.addedAt}</span></div>
          </div>
          {doc.keyFacts?.length > 0 && (
            <div className="sum-block">
              <div className="sum-label">Key Facts</div>
              <div style={{ marginTop: '4px' }}>
                {doc.keyFacts.map((f, i) => <div key={i} className="chip">• {f}</div>)}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'txt' && (
        <div className="dpanel">
          {doc.extractedText
            ? <>
                <div className="sum-label" style={{ marginBottom: '6px' }}>Extracted Text</div>
                <div className="ocr-text">{doc.extractedText}</div>
              </>
            : <div style={{ color: 'var(--ink3)', fontSize: '13px', textAlign: 'center', padding: '2rem' }}>No text extracted.</div>
          }
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="dpanel" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
          <div className="chat-wrap" style={{ padding: '14px' }}>
            <div className="chat-msgs" ref={msgsRef}>
              <div className="msg ai">Hi! I've read this document. Ask me anything about it.</div>
              {chatHistory.map((m, i) => (
                <div key={i} className={`msg ${m.role}`}>{m.content}</div>
              ))}
              {sending && <div className="msg ai typing">Thinking…</div>}
            </div>
            <div className="chat-input">
              <textarea
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask about this document…"
              />
              <button className="chat-send" onClick={handleSend} disabled={sending}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
