import './Header.css';

export default function Header({ searchQuery, onSearchChange, totalDocs, totalYears }) {
  return (
    <header>
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
