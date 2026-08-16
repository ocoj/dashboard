# 更改记录

## [v2.91.1-zh] — 2026-08-16

### 上游同步（v2.90.7 → v2.91.1）
- 同步 netbirdio/dashboard #718..#759，含 v2.90.8/9/10、v2.91.0、v2.91.1
- Next.js 16.1 → 16.3，Docker 基础镜像 Alpine 3.24
- Agent Network：新增 Kimi(Moonshot AI) 供应商、prompt-cache tokens 计量、per-provider disable-metadata 开关
- Linux 安装 Tab 重构：多发行版支持（Debian/Fedora/RHEL/AlmaLinux/openSUSE/Amazon Linux）
- Entra ID SCIM 向导更新（新 Azure 门户 UI）
- 版本检测修复、导航图标对齐、移除 onboarding 预约弹窗

### i18n 增量汉化
- LinuxTab：发行版选择器说明、标题、placeholder、note 汉化
- Agent Network：token 成本计量标签（input/output/cache read/cache write）
- AIProvidersProvider：toast 通知（端点设置失败/账户控制更新）
- VersionInfo：侧栏 Installed/Latest 版本显示
- EntraSCIMSetup：完整汉化 SCIM 设置向导（6 步引导，Azure 门户 UI 元素名保留英文）
- zh-map 新增约 78 条翻译

## [v2.90.4-zh] — 2026-07-19

### 网络连通性修复
- **根因**：netbird-server Docker bridge 模式，relay/signal 经 NPM 代理后源 IP 被 NAT 改写，peer 间无法获取真实端点
- **修复**：netbird-server → `network_mode: host`，STUN (UDP 3478) 直连，WireGuard P2P 恢复
- NPM 路由：API/WS/gRPC 与 Dashboard 经内网代理转发（端口配置见 `internal/` 部署文档）
- KK 网络策略：内网网段资源 + 3 routing peer + kk Access 全协议允许

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
