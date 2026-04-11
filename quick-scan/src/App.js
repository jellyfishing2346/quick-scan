import { useState, useRef, useEffect, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import Detail from './components/Detail';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function App() {
  const [docs, setDocs] = useState(() => {
    try {
      const saved = localStorage.getItem('qs-docs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeYear, setActiveYear] = useState('all');
  const [selDoc, setSelDoc] = useState(null);
  const [activeTab, setActiveTab] = useState('sum');
  const [toastMsg, setToastMsg] = useState('');
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('qs-chat');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('qs-docs', JSON.stringify(docs.filter(d => d.status !== 'pending')));
    } catch (err) {
      if (err.name === 'QuotaExceededError') showToast('Storage full — some documents may not persist');
    }
  }, [docs]);

  useEffect(() => {
    try {
      localStorage.setItem('qs-chat', JSON.stringify(chatHistory));
    } catch {
      // non-critical
    }
  }, [chatHistory]);

  function showToast(msg) {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(''), 3500);
  }

  async function callClaude(messages, maxTokens = 1200) {
    const r = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: maxTokens, messages })
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${r.status}`);
    }
    const d = await r.json();
    return d.content?.find(b => b.type === 'text')?.text || '';
  }

  function toBase64(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  async function processFile(file) {
    const pendingId = Date.now() + Math.random();
    setDocs(prev => [...prev, {
      id: pendingId,
      name: file.name.replace(/\.[^.]+$/, ''),
      status: 'pending',
      addedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }]);
    setChatHistory(prev => ({ ...prev, [pendingId]: [] }));

    try {
      const b64full = await toBase64(file);
      const isImage = file.type.startsWith('image/');
      const b64 = b64full.split(',')[1];

      let year = 'Unknown', docType = 'Document', extractedText = '', summary = '', keyFacts = [];

      try {
        const contentBlock = isImage
          ? { type: 'image', source: { type: 'base64', media_type: file.type, data: b64 } }
          : { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: b64 } };

        const raw = await callClaude([{
          role: 'user',
          content: [
            contentBlock,
            {
              type: 'text',
              text: 'Analyze this document carefully and respond ONLY with a JSON object (no markdown, no extra text):\n{\n  "year": "detected year or Unknown",\n  "type": "document type (Invoice, Receipt, Letter, Contract, Tax Form, Report, ID, Certificate, etc.)",\n  "extractedText": "all readable text from the document verbatim, preserving structure",\n  "summary": "2-3 sentence plain English summary of what this document is, who it involves, and key details",\n  "keyFacts": ["fact 1", "fact 2", "fact 3"]\n}'
            }
          ]
        }], 1500);

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON in response');
        const parsed = JSON.parse(jsonMatch[0]);
        year = parsed.year || 'Unknown';
        docType = parsed.type || 'Document';
        extractedText = parsed.extractedText || '';
        summary = parsed.summary || '';
        keyFacts = parsed.keyFacts || [];
      } catch (err) {
        console.warn('AI analysis failed:', err.message);
        showToast('AI error: ' + err.message);
      }

      let pdfUrl = b64full;
      if (isImage) {
        const img = new Image();
        img.src = b64full;
        await new Promise(r => { img.onload = r; });
        const w = img.naturalWidth || 800, h = img.naturalHeight || 1100;
        const pdf = new jsPDF({ orientation: w > h ? 'landscape' : 'portrait', unit: 'px', format: [w, h] });
        pdf.addImage(b64full, file.type.includes('png') ? 'PNG' : 'JPEG', 0, 0, w, h);
        pdfUrl = pdf.output('datauristring');
      }

      setDocs(prev => prev.map(d => d.id === pendingId ? {
        ...d,
        status: 'done',
        type: docType, year, pdfUrl,
        thumbUrl: isImage ? b64full : null,
        extractedText, summary, keyFacts
      } : d));
      showToast(`Filed under ${year}`);
    } catch (err) {
      showToast('Error: ' + err.message);
      setDocs(prev => prev.filter(d => d.id !== pendingId));
      console.error(err);
    }
  }

  async function handleFiles(files) {
    if (!files.length) return;
    const oversized = files.find(f => f.size > MAX_FILE_SIZE);
    if (oversized) { showToast(`${oversized.name} exceeds the 10 MB limit`); return; }
    await Promise.all(files.map(f => processFile(f)));
  }

  function getYears() {
    const m = {};
    docs.filter(d => d.status !== 'pending').forEach(d => { m[d.year] = (m[d.year] || 0) + 1; });
    return Object.entries(m).sort((a, b) => {
      if (a[0] === 'Unknown') return 1;
      if (b[0] === 'Unknown') return -1;
      return parseInt(b[0]) - parseInt(a[0]);
    });
  }

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const pending = docs.filter(d => d.status === 'pending');
    let done = activeYear === 'all'
      ? docs.filter(d => d.status !== 'pending')
      : docs.filter(d => d.status !== 'pending' && d.year === activeYear);
    if (q) done = done.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q) ||
      d.year.includes(q) ||
      (d.extractedText && d.extractedText.toLowerCase().includes(q)) ||
      (d.summary && d.summary.toLowerCase().includes(q))
    );
    return [...pending, ...done];
  }, [docs, activeYear, searchQuery]);

  function handleDelete(id) {
    if (!window.confirm('Remove this document? This cannot be undone.')) return;
    if (selDoc?.id === id) setSelDoc(null);
    setDocs(prev => {
      const next = prev.filter(d => d.id !== id);
      if (activeYear !== 'all' && !next.find(d => d.year === activeYear && d.status !== 'pending')) setActiveYear('all');
      return next;
    });
    showToast('Document removed');
  }

  function handleDownload(doc) {
    const a = document.createElement('a');
    a.href = doc.pdfUrl;
    a.download = `${doc.name}_${doc.year}.pdf`;
    a.click();
  }

  function handleSelectDoc(doc) {
    if (doc.status === 'pending') return;
    setSelDoc(doc);
    setActiveTab('sum');
  }

  async function handleSendChat(doc, question) {
    const history = chatHistory[doc.id] || [];
    const withQuestion = [...history, { role: 'user', content: question }];
    setChatHistory(prev => ({ ...prev, [doc.id]: withQuestion }));

    const recentHistory = withQuestion.slice(-10);

    try {
      const context = `You are a helpful assistant analyzing a document.
Name: ${doc.name}
Type: ${doc.type}
Year: ${doc.year}
Extracted text: ${doc.extractedText || 'Not available'}
Summary: ${doc.summary || 'Not available'}

Answer questions about this document concisely. Conversation so far:
${recentHistory.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}`;

      const reply = await callClaude([{ role: 'user', content: context }], 600);
      setChatHistory(prev => ({
        ...prev,
        [doc.id]: [...(prev[doc.id] || []), { role: 'ai', content: reply }]
      }));
    } catch (err) {
      showToast('Chat error: ' + err.message);
    }
  }

  const years = getYears();
  const totalYears = years.filter(y => y[0] !== 'Unknown').length;
  const doneDocs = docs.filter(d => d.status !== 'pending');

  return (
    <div className="shell">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalDocs={doneDocs.length}
        totalYears={totalYears}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(o => !o)}
      />
      <div className="body">
        {menuOpen && <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}
        <Sidebar
          years={years}
          activeYear={activeYear}
          allCount={doneDocs.length}
          onYearChange={yr => { setActiveYear(yr); setMenuOpen(false); }}
          onFileUpload={handleFiles}
          isOpen={menuOpen}
        />
        <Main
          docs={filtered}
          allDocs={docs}
          activeYear={activeYear}
          selDoc={selDoc}
          searchQuery={searchQuery}
          onSelectDoc={handleSelectDoc}
          onDownload={handleDownload}
          onDelete={handleDelete}
          years={years}
          onFileUpload={handleFiles}
        />
        {selDoc && (
          <Detail
            doc={selDoc}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onClose={() => setSelDoc(null)}
            chatHistory={chatHistory[selDoc.id] || []}
            onSendChat={q => handleSendChat(selDoc, q)}
          />
        )}
      </div>
      {toastMsg && <div className="toast-el show">{toastMsg}</div>}
    </div>
  );
}

export default App;
