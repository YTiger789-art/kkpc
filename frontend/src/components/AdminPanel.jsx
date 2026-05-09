import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, message } from 'antd';
import { addResult } from '../api';

export default function AdminPanel(){
  const [form] = Form.useForm();
  const [loading,setLoading] = useState(false);
  const defaultApiKey = import.meta.env.VITE_ADMIN_KEY || '';

  async function onFinish(values){
    setLoading(true);
    try{
      const payload = { issue: values.issue, draw_time: values.draw_time || undefined, numbers: [Number(values.n0), Number(values.n1), Number(values.n2)] };
      const apiKey = values.apiKey || defaultApiKey;
      const res = await addResult(payload, apiKey);
      message.success(`添加 ${res.issue} 成功`);
      form.resetFields();
    }catch(err){
      console.error(err);
      message.error(err?.response?.data?.error || '添加失败');
    }finally{ setLoading(false); }
  }

  return (
    <Card title="管理员录入" className="card">
      <Form form={form} layout="inline" onFinish={onFinish}>
        <Form.Item name="issue" rules={[{ required:true }]}><Input placeholder="期号" /></Form.Item>
        <Form.Item name="n0" rules={[{ required:true }]}><Input placeholder="号1" style={{width:80}} /></Form.Item>
        <Form.Item name="n1" rules={[{ required:true }]}><Input placeholder="号2" style={{width:80}} /></Form.Item>
        <Form.Item name="n2" rules={[{ required:true }]}><Input placeholder="号3" style={{width:80}} /></Form.Item>
        <Form.Item name="draw_time"><Input placeholder="开奖时间 (ISO 可选)" style={{width:240}} /></Form.Item>
        <Form.Item name="apiKey"><Input placeholder="API Key (可空，使用 env)" style={{width:240}} /></Form.Item>
        <Form.Item><Space><Button htmlType="submit" type="primary" loading={loading}>添加</Button><Button onClick={()=>form.resetFields()}>重置</Button></Space></Form.Item>
      </Form>
    </Card>
  );
}
