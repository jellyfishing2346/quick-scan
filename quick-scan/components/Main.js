import React from 'react';
import './Main.css';

export default function Main() {
  return (
    <div className="main" id="main">
      <div className="empty" id="empty">
        <div className="empty-icon">📂</div>
        <div className="empty-t">Archive is empty</div>
        <div className="empty-s">Paste your Anthropic API key above, then upload a document to get started.</div>
      </div>
    </div>
  );
}
