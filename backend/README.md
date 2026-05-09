# PC28 API

后端 API（Express + MongoDB + Socket.IO）。在部署时请通过环境变量设置 MONGO_URI、PORT 和 ADMIN_KEY。

主要命令：

- npm start — 启动服务
- npm run seed -- --count=100 — 生成演示数据

API 列表：
- GET /health
- GET /api/result/latest
- GET /api/result/history?page=1&pageSize=20
- GET /api/result/:issue
- POST /api/result/add (x-api-key header required if ADMIN_KEY set)
- PUT /api/result/:issue (admin)
- DELETE /api/result/:issue (admin)
