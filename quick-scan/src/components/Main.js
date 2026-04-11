import { useState } from 'react';
import './Main.css';

function SkeletonCard() {
  return (
    <div className="card skeleton-card">
      <div className="skel-thumb"></div>
      <div className="cinfo">
        <div className="skel-line" style={{ width: '72%' }}></div>
        <div className="skel-line" style={{ width: '44%', marginTop: '6px' }}></div>
      </div>
      <div className="cacts">
        <div className="skel-line" style={{ width: '100%', height: '24px', borderRadius: '4px' }}></div>
      </div>
    </div>
  );
}

function DocCard({ doc, selected, onSelect, onDownload, onDelete }) {
  const thumb = doc.thumbUrl
    ? <img src={doc.thumbUrl} alt="" />
    : <span className="cph">📄</span>;

  return (
    <div className={`card${selected ? ' sel' : ''}`} onClick={() => onSelect(doc)}>
      <div className="cthumb">
        {thumb}
        <span className="cbadge">{doc.type}</span>
        {doc.summary && <span className="cai">AI ✓</span>}
      </div>
      <div className="cinfo">
        <div className="cname" title={doc.name}>{doc.name}</div>
        <div className="cmeta">{doc.addedAt} · {doc.year}</div>
      </div>
      <div className="cacts">
        <button className="cbtn pr" onClick={e => { e.stopPropagation(); onDownload(doc); }}>Download</button>
        <button className="cbtn" onClick={e => { e.stopPropagation(); onDelete(doc.id); }}>Remove</button>
      </div>
    </div>
  );
}

export default function Main({ docs, allDocs, activeYear, selDoc, searchQuery, onSelectDoc, onDownload, onDelete, years, onFileUpload }) {
  const [dragging, setDragging] = useState(false);

  function handleDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f =>
      f.type.startsWith('image/') || f.type === 'application/pdf'
    );
    if (files.length) onFileUpload(files);
  }

  const dragProps = { onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop };
  const pendingDocs = allDocs.filter(d => d.status === 'pending');
  const doneDocs = docs.filter(d => d.status !== 'pending');

  if (!doneDocs.length && !searchQuery && !pendingDocs.length) {
    return (
      <div className={`main${dragging ? ' drag-over' : ''}`} {...dragProps}>
        <div className="empty">
          <div className="empty-icon">📂</div>
          <div className="empty-t">{dragging ? 'Drop to scan' : 'Archive is empty'}</div>
          {!dragging && <div className="empty-s">Upload a document to get started.</div>}
        </div>
      </div>
    );
  }

  if (activeYear === 'all') {
    const q = searchQuery.trim().toLowerCase();
    return (
      <div className={`main${dragging ? ' drag-over' : ''}`} {...dragProps}>
        {dragging && <div className="drop-overlay"><span>Drop to scan</span></div>}
        {pendingDocs.length > 0 && (
          <div className="ysec">
            <div className="yhead">Processing</div>
            <div className="grid">
              {pendingDocs.map(d => <SkeletonCard key={d.id} />)}
            </div>
          </div>
        )}
        {years.map(([yr]) => {
          let ydocs = allDocs.filter(d => d.status !== 'pending' && d.year === yr);
          if (q) ydocs = ydocs.filter(d =>
            d.name.toLowerCase().includes(q) ||
            d.type.toLowerCase().includes(q) ||
            d.year.includes(q) ||
            (d.extractedText && d.extractedText.toLowerCase().includes(q)) ||
            (d.summary && d.summary.toLowerCase().includes(q))
          );
          if (!ydocs.length) return null;
          return (
            <div className="ysec" key={yr}>
              <div className="yhead">{yr}</div>
              <div className="grid">
                {ydocs.map(doc => (
                  <DocCard
                    key={doc.id} doc={doc} selected={selDoc?.id === doc.id}
                    onSelect={onSelectDoc} onDownload={onDownload} onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`main${dragging ? ' drag-over' : ''}`} {...dragProps}>
      {dragging && <div className="drop-overlay"><span>Drop to scan</span></div>}
      <div className="grid">
        {pendingDocs.map(d => <SkeletonCard key={d.id} />)}
        {doneDocs.map(doc => (
          <DocCard
            key={doc.id} doc={doc} selected={selDoc?.id === doc.id}
            onSelect={onSelectDoc} onDownload={onDownload} onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
