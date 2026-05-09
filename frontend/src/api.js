import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const client = axios.create({ baseURL: API_BASE, timeout: 8000 });

export async function fetchLatest() {
  const r = await client.get('/api/result/latest'); return r.data;
}
export async function fetchHistory(page=1,pageSize=20){
  const r = await client.get('/api/result/history',{ params:{ page, pageSize }});
  return r.data;
}
export async function addResult(payload, apiKey=''){
  return client.post('/api/result/add', payload, { headers: apiKey ? { 'x-api-key': apiKey } : {} }).then(r=>r.data);
}
export async function updateResult(issue,payload,apiKey=''){
  return client.put(`/api/result/${issue}`, payload, { headers: apiKey ? { 'x-api-key': apiKey } : {} }).then(r=>r.data);
}
export async function deleteResult(issue,apiKey=''){
  return client.delete(`/api/result/${issue}`, { headers: apiKey ? { 'x-api-key': apiKey } : {} }).then(r=>r.data);
}
