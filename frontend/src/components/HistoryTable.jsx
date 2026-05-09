import React, { useEffect, useState } from 'react';
import { Card, Table } from 'antd';
import dayjs from 'dayjs';
import { fetchHistory } from '../api';

export default function HistoryTable(){
  const [data,setData]=useState([]);
  const [pagination,setPagination]=useState({ current:1, pageSize:20, total:0 });
  const [loading,setLoading]=useState(false);

  async function load(page=1, pageSize=20){
    setLoading(true);
    try{
      const res = await fetchHistory(page,pageSize);
      setData(res.data||[]);
      setPagination(p=>({ ...p, current: res.page||page, pageSize: res.pageSize||pageSize, total: res.total||0 }));
    }catch(err){ console.error(err); } finally { setLoading(false); }
  }

  useEffect(()=>{ load(pagination.current,pagination.pageSize); }, []);

  const columns = [
    { title:'期号', dataIndex:'issue', key:'issue' },
    { title:'开奖时间', dataIndex:'draw_time', key:'draw_time', render: v => v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-' },
    { title:'号码', dataIndex:'numbers', key:'numbers', render: nums => nums ? nums.join(' , ') : '-' },
    { title:'和值', dataIndex:'sum', key:'sum' }
  ];

  return (
    <Card title="历史开奖记录" className="card">
      <Table columns={columns} dataSource={data} rowKey="issue" pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: (p,ps) => load(p,ps)
      }} loading={loading} />
    </Card>
  );
}
