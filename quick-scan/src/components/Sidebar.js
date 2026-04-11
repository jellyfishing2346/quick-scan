import './Sidebar.css';

export default function Sidebar({ years, activeYear, allCount, onYearChange, onFileUpload, isOpen }) {
  function handleChange(e) {
    const files = Array.from(e.target.files);
    e.target.value = '';
    onFileUpload(files);
  }

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      <div className="slabel">Scan</div>
      <label className="scanzone">
        <input type="file" accept="image/*,.pdf" multiple onChange={handleChange} />
        <span className="sz-icon">📄</span>
        <div className="sz-title">Upload & Scan</div>
        <div className="sz-sub">JPG, PNG or PDF<br />AI reads + summarizes</div>
      </label>
      <div className="slabel">Archive</div>
      <div id="ylist">
        <div
          className={`yitem${activeYear === 'all' ? ' active' : ''}`}
          onClick={() => onYearChange('all')}
        >
          <span className="ylabel" style={{ fontSize: '13px' }}>All Documents</span>
          <span className="ybadge">{allCount}</span>
        </div>
        {years.map(([yr, cnt]) => (
          <div
            key={yr}
            className={`yitem${activeYear === yr ? ' active' : ''}`}
            onClick={() => onYearChange(yr)}
          >
            <span className="ylabel">{yr}</span>
            <span className="ybadge">{cnt}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
