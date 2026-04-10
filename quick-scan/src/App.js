
import React from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import Detail from './components/Detail';

function App() {
  return (
    <div className="shell">
      <Header />
      <div className="body">
        <Sidebar />
        <Main />
        <Detail />
      </div>
      <div className="proc-bar" id="proc">
        <div className="proc-box">
          <div className="spin"></div>
          <div className="pt" id="pt">Scanning…</div>
          <div className="ps" id="ps">Please wait</div>
        </div>
      </div>
      <div className="toast-el" id="toast"></div>
    </div>
  );
}

export default App;
