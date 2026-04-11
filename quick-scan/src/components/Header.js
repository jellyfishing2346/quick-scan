import './Header.css';

export default function Header({ searchQuery, onSearchChange, totalDocs, totalYears, menuOpen, onMenuToggle }) {
  return (
    <header>
      <button className="menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
        <span className={`menu-icon${menuOpen ? ' open' : ''}`}></span>
      </button>
      <div className="logo"><div className="badge">QS</div>QuickScan</div>
      <div className="search-wrap">
        <input
          type="text"
          placeholder="Search documents"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <div className="hstats">
        <span className="sp">Docs: <span>{totalDocs}</span></span>
        <span className="sp">Years: <span>{totalYears}</span></span>
      </div>
    </header>
  );
}
