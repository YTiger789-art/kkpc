# PC28 完整项目

此仓库包含 PC28 开奖系统的完整代码：后端（Express + MongoDB + Socket.IO）与前端（Vite + React + Ant Design），以及 Dockerfile 与 docker-compose 用于一键部署。

部署建议（Railway 推荐）

1. 将本仓库连接到 Railway 并创建一个新项目。
2. 在 Railway 中添加 MongoDB 插件（或使用 MongoDB Atlas），复制提供的 MONGO_URI 到 API 服务的环境变量。
3. 在 Railway 为 API 服务设置环境变量：
   - MONGO_URI (来自 Railway MongoDB 插件)
   - PORT = 3000
   - ADMIN_KEY = change-me (或你自己设置)
4. 在 Railway 为 Web 服务设置环境变量：
   - VITE_API_BASE = https://<your-api-service>.up.railway.app
   - VITE_WS_BASE = https://<your-api-service>.up.railway.app
   - VITE_ADMIN_KEY = change-me
5. 部署并等待构建完成。访问前端地址（Railway 分配的域名）。

如果使用 VPS + docker-compose：

1. 编辑 backend/.env.example 复制为 .env 并设置 MONGO_URI、ADMIN_KEY 等。
2. 编辑 frontend/.env.example 复制为 .env 并设置 VITE_API_BASE、VITE_WS_BASE。
3. 运行 docker-compose up -d --build

在部署完成后，如果你想生成演示数据：
- 通过进入 API 容器运行：
  docker-compose exec api node scripts/genResult.js --count=200

如需我代为完成 Railway 上的最后一步（设置 env、触发部署），请授权我对该 GitHub 仓库的写入权限（或者将仓库设为可写并把 repo 地址确认无误）。
