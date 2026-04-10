import React from 'react';
import './Detail.css';

export default function Detail() {
  return (
    <div className="detail hidden" id="detail">
      <div className="dhead">
        <div className="dtitle" id="dtitle">Document</div>
        <button className="dclose" id="dclose">✕</button>
      </div>
      <div className="dtabs">
        <div className="dtab active" data-tab="sum">Summary</div>
        <div className="dtab" data-tab="txt">Text</div>
        <div className="dtab" data-tab="chat">Chat</div>
      </div>
      <div className="dpanel" id="pan-sum"><div id="sum-content"></div></div>
      <div className="dpanel hidden" id="pan-txt"><div id="txt-content"></div></div>
      <div className="dpanel hidden" id="pan-chat" style={{display:'none'}}>
        <div className="chat-wrap">
          <div className="chat-msgs" id="chat-msgs"></div>
          <div className="chat-input">
            <textarea id="chat-in" placeholder="Ask about this document…"></textarea>
            <button className="chat-send" id="chat-send">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}