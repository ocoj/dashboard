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

- Next.js 16（静态导出 `output: "export"`）
- React 18 + TypeScript + Tailwind CSS
- next-intl 国际化
- Node.js + Docker（内置轻量 HTTP 服务器，无需 Nginx）

## 快速部署

### 方式一：拉取预构建镜像（推荐）

```bash
# 从 GitHub Container Registry 拉取
docker pull ghcr.io/ocoj/dashboard:v2.90.3-zh

# 运行（容器内监听 80 端口）
docker run -d --name netbird-dashboard --restart unless-stopped \
  -p 30443:80 \
  -e AUTH_AUTHORITY=<你的认证服务地址> \
  -e AUTH_CLIENT_ID=<客户端 ID> \
  -e AUTH_AUDIENCE=<Audience> \
  -e AUTH_SUPPORTED_SCOPES='openid profile email' \
  -e USE_AUTH0=false \
  -e NETBIRD_MGMT_API_ENDPOINT=<NetBird 管理 API 地址> \
  ghcr.io/ocoj/dashboard:v2.90.3-zh
```

> 镜像由 GitHub Actions 自动构建，每次推送 tag 或 `i18n-next` 分支时触发。

### 查看可用版本

在 [GitHub Packages](https://github.com/ocoj/dashboard/pkgs/container/dashboard) 查看所有可用镜像 tag。

### 方式二：本地构建

```bash
npm ci && npx next build
docker build -f docker/Dockerfile -t netbird-dashboard:amd64 .
```

### 方式三：构建脚本 + 远程部署

```bash
# 构建并导出 tar.gz
./build.sh

# 上传到服务器
scp netbird-dashboard.tar.gz user@your-server:/tmp/

# 在服务器上加载并运行
ssh user@your-server
docker load < /tmp/netbird-dashboard.tar.gz
docker run -d --name netbird-dashboard --restart unless-stopped \
  -p 30443:80 \
  -e AUTH_AUTHORITY=... \
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
