import React, { useEffect, useState } from 'react';
import { Card, Button, Space } from 'antd';
import dayjs from 'dayjs';
import { fetchLatest } from '../api';
import { io } from 'socket.io-client';

export default function LatestResult() {
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(false);
  const WS_BASE = import.meta.env.VITE_WS_BASE || 'http://localhost:3000';

  async function load() {
    setLoading(true);
    try {
      const data = await fetchLatest();
      setLatest(data && Object.keys(data).length ? data : null);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    load();
    const socket = io(WS_BASE);
    socket.on('connect', () => console.log('socket connected', socket.id));
    socket.on('new_result', r => { setLatest(r && Object.keys(r).length ? r : null); });
    socket.on('disconnect', () => console.log('socket disconnected'));
    const id = setInterval(load, 10000);
    return () => { clearInterval(id); socket.disconnect(); };
    // eslint-disable-next-line
  }, []);

  return (
    <Card title="最新开奖结果" className="card" extra={<Space><Button onClick={load} loading={loading} size="small">刷新</Button></Space>}>
      {latest ? (
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{color:'#888'}}>期号：{latest.issue}</div>
            <div style={{color:'#888'}}>开奖时间：{latest.draw_time ? dayjs(latest.draw_time).format('YYYY-MM-DD HH:mm:ss') : '-'}</div>
            <div style={{marginTop:12, display:'flex', alignItems:'center'}}>
              {latest.numbers?.map((n,idx)=>(<div key={idx} className="ball" style={{borderColor:'#1890ff', color:'#1890ff'}}>{n}</div>))}
              <div style={{marginLeft:12, fontWeight:600}}>和值：{latest.sum}</div>
            </div>
          </div>
          <div style={{color:'#999'}}>实时推送已启用</div>
        </div>
      ) : <div style={{color:'#666'}}>暂无开奖结果</div>}
    </Card>
  );
}
