# 更改记录

## [v2.94.0-zh] — 2026-10-03

### 上游同步（v2.91.1 → v2.94.0）
- 同步 netbirdio/dashboard v2.92.0 / v2.93.0 / v2.94.0
- 真实增量：406 个文件，+58,463 / −8,305（其中 src/ 358 文件）
- **Control Center 草稿模式**：47 个新组件（画布草稿、变更集、审查部署）
- **Cloud 登录域名（Sign-in Domains）**：5 个新组件
- Agent Network：新增 `connect` 页、ConnectProvidersTable、Kimi/Claude Code/Codex 供应商
- 上游引入单元测试基建（vitest + testing-library + jsdom，35 个测试文件）
- 移除 `firewall-gpt` 模块（21 个文件）；Docker rootless 支持
- 依赖：Next.js 16.3.0 → 16.3.4；**Node 引擎 >=20.9.0 → >=24.0.0**
- 新增 `announcement` 配置项（`config.json`）

### 同步技术要点
- 2026-08 的 `git filter-repo` 重写全部提交 SHA，merge-base 退化到根提交，
  常规 `git merge` 会重放 622 个提交。改用「嫁接提交 + 真三方合并」修复基线，
  分支历史已重新与上游对齐，后续可直接 `git merge netbirdio/main`
- 解决 44 个文件的 72 个冲突块：导入取并集，逻辑取上游，保留我方汉化层
- 保留我方定制：`build_and_push.yml`（GHCR CI）、`docker/`、`next.config.js`

### 环境
- Node 升级至 24（本地 nvm v24.21.0 + CI `node-version: 24`）
- npm 11.19.0；`npm install` 同步依赖

### i18n 汉化
- 分批汉化：冲突文件恢复 + 新增模块 → 全站独占元素文案 → 字符串属性
  → 混合内容（句子与内联组件交错）→ 扫描盲区补齐
- 独占元素文案覆盖达 100%（剩余为 TCP/UDP/URL/DNS 及 MS Graph 权限名，应保留英文）
- 字符串属性统一为 `zhMap["X"] || "X"` 写法（322 处）
- **混合内容 141 处 → 10 处**（剩余为 `Ctrl`/`Alt` 键盘键名、`SSH`/`RDP`/`DNS`
  技术标识、`N/A`，均为刻意保留）
- **扫描盲区补齐**：修复五类此前未被覆盖的文本节点
  （后跟闭合标签、子元素之后、小写开头、含表达式、已部分汉化的块）
- TransText 覆盖：238 → **477 / 943** 个 tsx 文件
- `zh-map.ts`：2557 → **3415** 条（无重复）

### 安全
- 移除上游 6 处源码中的疑似 Azure 客户端密钥示例串
  （`AzureADSetup` / `AzureADConfiguration` / `GoogleWorkspaceSetup` /
  `GoogleWorkspaceConfiguration` / `IntuneSetup` / `IntuneConfiguration`），
  改为 `"your-client-secret"`。该串源自上游 commit `7653e341`，非本次引入；
  上游侧未上报（用户决定），我方仓库处置完毕

### 验证
- `npx tsc --noEmit` 零错误
- `npx next build` 通过，侧栏版本显示 `v2.94.0-zh`
- 真机遍历 16 个页面：无 `MISSING_MESSAGE`、无英文残留

### 已知遗留
- 无。`<TransText>{表达式}</TransText>` 经复核实为正常用法（变量为字符串时可查表），
  非缺陷

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
