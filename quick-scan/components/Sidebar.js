import React from 'react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="slabel">Scan</div>
      <label className="scanzone">
        <input type="file" id="finput" accept="image/*,.pdf" multiple />
        <span className="sz-icon">📄</span>
        <div className="sz-title">Upload & Scan</div>
        <div className="sz-sub">JPG, PNG or PDF<br />AI reads + summarizes</div>
      </label>
      <div className="slabel">Archive</div>
      <div id="ylist">
        <div className="yitem active" data-y="all">
          <span className="ylabel" style={{fontSize:'13px'}}>All Documents</span>
          <span className="ybadge" id="ac">0</span>
        </div>
      </div>
    </aside>
  );
}
