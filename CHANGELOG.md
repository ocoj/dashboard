# 更改记录

## [v2.90.4-zh] — 2026-07-19

### 网络连通性修复
- **根因**：netbird-server Docker bridge 模式，relay/signal 经 NPM 代理后源 IP 被 NAT 改写，peer 间无法获取真实端点
- **修复**：netbird-server → `network_mode: host`，STUN (UDP 3478) 直连，WireGuard P2P 恢复
- NPM 路由：API/WS/gRPC → `***REMOVED***:8081`，Dashboard → `***REMOVED***:30000`
- KK 网络策略：`***REMOVED***/24` 资源 + 3 routing peer + kk Access 全协议允许

### i18n 汉化（第 3 轮）
- dayjs 中文 locale 动态切换（LocaleProvider → dayjs.locale()）
- zh-map +~30 条目（密码/菜单/角色/网络标签）
- TransText：UserDropdown、ChangePasswordModal、VersionInfo、LastTimeRow、SetupKeyUsageCell、TrafficEventsPeerTabContent
- 修复 `Create Key` → `创建密钥`（原值为英文原文）

### 版本号规则
- 新增 `VERSION.md` 正式规则
- `next.config.js`：从 `package.json` 读取 + 自动追加 `-zh` + 正则校验
- 侧栏：`控制台 v2.90.4-zh`

### 上游同步 (2026-07-17)
- netbirdio/dashboard #709/#710/#714/#717
- Agent Network、RDP Linux/FreeBSD、IdP cards 修复
- +14 翻译 key，CI `git describe --tags` 自动版本

## [未发布]

- 初始化 NetBrid 汉化与部署项目
- Dashboard 汉化 10/10 模块完成
- OMV Docker Compose 部署
- 项目目录：合并 → `netbird-dashboard`
- i18n：`zh_CN/` + `translations/` → `i18n/`
