# NetBird Dashboard - 中文汉化版

基于 [NetBird Dashboard](https://github.com/netbirdio/dashboard) 的全面中文化版本。

> **演示地址**：https://nb.lanxun.pro:30443  
> **Docker 镜像**：`ghcr.io/ocoj/dashboard`

## 特性

- ✅ 全站界面中文化（侧栏、表格、弹窗、Tooltip、通知等）
- ✅ 支持中/英文切换（右上角语言选择器）
- ✅ 跟随上游版本迭代
- ✅ 静态导出，Nginx 部署，轻量高效

## 技术栈

- Next.js（静态导出 `output: "export"`）
- React + TypeScript + Tailwind CSS
- next-intl 国际化
- Nginx + Docker

## 快速部署

### 方式一：Docker 镜像（推荐）

```bash
docker run -d --name netbird-dashboard --restart unless-stopped \
  -p 30443:443 \
  -e AUTH_AUTHORITY=<你的认证服务地址> \
  -e AUTH_CLIENT_ID=<客户端 ID> \
  -e AUTH_AUDIENCE=<Audience> \
  -e AUTH_SUPPORTED_SCOPES='openid profile email' \
  -e USE_AUTH0=false \
  -e NETBIRD_MGMT_API_ENDPOINT=<NetBird 管理 API 地址> \
  ghcr.io/ocoj/dashboard:v2.90.3-zh
```

### 方式二：本地构建

```bash
# 构建静态文件
npm ci && npx next build

# 构建 Docker 镜像
docker build -f docker/Dockerfile -t netbird-dashboard .

# 或使用构建脚本
./build.sh
```

### 方式三：SSH 部署到远程服务器

```bash
# 本地构建并导出镜像
./build.sh

# 上传到服务器
scp netbird-dashboard.tar.gz root@***REMOVED***:/tmp/

# 在服务器上加载并运行
ssh root@***REMOVED***
docker load < /tmp/netbird-dashboard.tar.gz
docker run -d --name netbird-dashboard --restart unless-stopped \
  -p 30443:443 \
  ...（环境变量同上）\
  netbird-dashboard:amd64
```

### 环境变量说明

| 变量 | 必填 | 说明 |
|------|------|------|
| `AUTH_AUTHORITY` | 是 | OIDC 认证服务地址 |
| `AUTH_CLIENT_ID` | 是 | OAuth2 客户端 ID |
| `AUTH_AUDIENCE` | 否 | JWT Audience |
| `AUTH_SUPPORTED_SCOPES` | 否 | 支持的 OAuth Scope |
| `USE_AUTH0` | 否 | 是否使用 Auth0（默认 false） |
| `NETBIRD_MGMT_API_ENDPOINT` | 是 | NetBird 管理 API 地址 |
| `NETBIRD_MGMT_GRPC_API_ENDPOINT` | 否 | gRPC API 地址 |

## 本地开发

```bash
npm install
echo '{}' > .local-config.json
npm run dev
```

打开 http://localhost:3000

## 切换语言

- **界面操作**：右上角"选择语言" → 中文 / English
- **Cookie 方式**：设置 `NEXT_LOCALE=zh` 或 `NEXT_LOCALE=en`

## 版本说明

版本号格式：`v<上游版本>-zh`，如 `v2.90.3-zh` 表示基于上游 v2.90.3 的中文汉化版。

## 相关链接

- [NetBird 官方](https://netbird.io/)
- [上游 Dashboard 仓库](https://github.com/netbirdio/dashboard)
- [NetBird 文档](https://docs.netbird.io/)
