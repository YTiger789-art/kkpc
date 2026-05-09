import React from 'react';
import LatestResult from './components/LatestResult';
import HistoryTable from './components/HistoryTable';
import AdminPanel from './components/AdminPanel';

export default function App() {
  return (
    <div>
      <header className="header">
        <div style={{fontSize:18, fontWeight:600}}>PC28 开奖系统</div>
        <div style={{fontSize:13, opacity:0.9}}>演示前端 - 连接后端 API</div>
      </header>
      <div className="container">
        <LatestResult />
        <HistoryTable />
        <AdminPanel />
      </div>
    </div>
  );
}
