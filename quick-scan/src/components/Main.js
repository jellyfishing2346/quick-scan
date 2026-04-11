import './Main.css';

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

export default function Main({ docs, allDocs, activeYear, selDoc, searchQuery, onSelectDoc, onDownload, onDelete, years }) {
  if (!docs.length && !searchQuery) {
    return (
      <div className="main">
        <div className="empty">
          <div className="empty-icon">📂</div>
          <div className="empty-t">Archive is empty</div>
          <div className="empty-s">Upload a document to get started.</div>
        </div>
      </div>
    );
  }

  if (activeYear === 'all') {
    const q = searchQuery.trim().toLowerCase();
    return (
      <div className="main">
        {years.map(([yr]) => {
          let ydocs = allDocs.filter(d => d.year === yr);
          if (q) ydocs = ydocs.filter(d =>
            d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q) || d.year.includes(q)
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
    <div className="main">
      <div className="grid">
        {docs.map(doc => (
          <DocCard
            key={doc.id} doc={doc} selected={selDoc?.id === doc.id}
            onSelect={onSelectDoc} onDownload={onDownload} onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
