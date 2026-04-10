import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header>
      <div className="logo"><div className="badge">QS</div>QuickScan</div>
      <div className="search-wrap"><input type="text" id="search" placeholder="Search documents" /></div>
      <div className="key-wrap">
        <label>API KEY</label>
        <input type="password" id="apikey" placeholder="test" autoComplete="off" />
        <span className="key-status no" id="key-status">No key</span>
      </div>
      <div className="hstats">
        <span className="sp">Docs: <span id="tdocs">0</span></span>
        <span className="sp">Years: <span id="tyears">0</span></span>
      </div>
    </header>
  );
}