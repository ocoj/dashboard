# NetBird Dashboard 部署与维护指南

## 环境

| 项目 | 值 |
|------|-----|
| GitHub | https://github.com/ocoj/dashboard |
| 镜像仓库 | ghcr.io/ocoj/dashboard |
| 分支 | `i18n-clean`（主分支） |
| 服务器 | ***REMOVED***（OMV） |
| 访问地址 | https://nb.lanxun.pro:30443 |

## 镜像拉取（OMV 上）

```bash
# 首次需要登录（只需一次）：
echo "你的GitHub PAT" | docker login ghcr.io -u ocoj --password-stdin

# 拉取最新版本：
docker pull ghcr.io/ocoj/dashboard:latest

# 偶尔想固定版本时，拉取特定 tag：
docker pull ghcr.io/ocoj/dashboard:v2.90.3-zh
```

## 更新部署（OMV 上正确步骤）

```bash
# 1. 拉取新镜像
docker pull ghcr.io/ocoj/dashboard:latest

# 2. 停止旧容器
docker stop netbird-dashboard
docker rm netbird-dashboard

# 3. 启动新容器（NPM 代理到 30000 端口，不要改 NPM 配置）
docker run -d --name netbird-dashboard --restart unless-stopped \
  -p 30000:80 \
  -e AUTH_AUTHORITY=https://nb.lanxun.pro:30443/oauth2 \
  -e AUTH_CLIENT_ID=netbird-dashboard \
  -e AUTH_AUDIENCE=netbird-dashboard \
  -e AUTH_SUPPORTED_SCOPES="openid profile email" \
  -e USE_AUTH0=false \
  -e NETBIRD_MGMT_API_ENDPOINT=https://nb.lanxun.pro:30443 \
  -e NETBIRD_MGMT_GRPC_API_ENDPOINT=https://nb.lanxun.pro:30443 \
  -e AUTH_REDIRECT_URI=https://nb.lanxun.pro:30443 \
  -e AUTH_SILENT_REDIRECT_URI=https://nb.lanxun.pro:30443/silent-renew \
  -e NETBIRD_TOKEN_SOURCE=accessToken \
  ghcr.io/ocoj/dashboard:latest
```

> ⚠️ **端口 30000 不能变**，NPM 已配置代理到该端口。不要改 NPM 配置。

## 版本策略

CI 通过 `git describe --tags --always` 自动派生版本号，无需手动打 tag。

| 场景 | 版本号示例 |
|------|-----------|
| 正好在 tag `v2.90.4-zh` 上 | `v2.90.4-zh` |
| tag 之后 3 个提交 | `v2.90.4-zh-3-g4d1bb9c` |
| 无 tag（首次） | commit 短 hash |

| 镜像 tag | 含义 | 触发条件 |
|----------|------|---------|
| `latest` | 每次 push i18n-clean 自动更新 | 分支 push |
| `v2.90.4-zh` | 版本快照（可选） | `git tag` + push |
| `i18n-clean` | 分支名镜像 | Actions 自动构建 |

### 发布新版本

```bash
# 本地开发完成后 push 即可，版本号自动派生：
git add -A
git commit -m "描述修改"
git push origin i18n-clean

# 可选：打版本 tag 做快照
git tag v2.90.4-zh        # 版本号跟着上游 vX.Y.Z-zh
git push origin v2.90.4-zh

# 更新 CHANGELOG.md 记录变更
```

### 版本号规则

`v<上游版本>-zh`，如 `v2.90.3-zh` 表示基于上游 v2.90.3 的汉化版。
如果上游升级到 v2.91.0，我们同步后打 `v2.91.0-zh`。

## 本地开发

```bash
cd /home/lsj/workspace/project/NetBrid/netbird-dashboard
npm install
echo '{}' > .local-config.json
npm run dev          # 开发
npx tsc --noEmit     # 类型检查
npx next build       # 构建
```

## 故障排查

### GHCR 拉取 403
```bash
docker login ghcr.io -u ocoj --password-stdin
```

### 页面打不开
1. `docker ps | grep dashboard` 确认容器在跑
2. `curl http://127.0.0.1:30000/` 确认本地可达
3. 确认 NPM 端口没被改(`set $port 30000`)

### 清理悬空镜像
```bash
docker image prune -f
```
