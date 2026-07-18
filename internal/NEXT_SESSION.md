# 继续汉化任务 — 新会话提示词

## 背景

本仓库是 [NetBird Dashboard](https://github.com/netbirdio/dashboard) 的中文汉化分支 (`i18n-clean`)。

**当前状态**：已合并上游 v2.90.4+，i18n 架构已从 next-intl 迁移到自建 TransText 方案。全局可见组件和 Peers/Users 模块已完成汉化，约 205 个业务页面组件仍为英文硬编码。

## 关键信息

| 项目 | 值 |
|------|-----|
| 代码位置 | `/home/lsj/workspace/project/NetBrid/netbird-dashboard/` |
| 分支 | `i18n-clean` |
| 上游 | `netbirdio/main` |
| 部署地址 | `https://nb.lanxun.pro:30443` |
| 完整 SOP | `internal/上游同步与汉化发布提示词.md` |

## 凭据获取

所有密码/Token 通过 Vaultwarden MCP 获取：

| 用途 | Vaultwarden 搜索关键字 |
|------|----------------------|
| GitHub Token | `netbird Github Token` |
| OMV SSH 密码 | `omv ssh` |
| Web 登录凭据 | `netbird dashboard web` |

## 当前进度

### 已完成（22 个文件）

**全局组件 (9 个)**：
- `src/layouts/Navigation.tsx` — 侧栏导航全部 29 个标签
- `src/components/ui/LocaleSwitcher.tsx` — 语言切换
- `src/modules/settings/LanguageTab.tsx` — 设置页语言
- `src/layouts/AppLayout.tsx` — LocaleProvider 包裹
- `src/components/ui/NoResults.tsx` + `NoResultsCard.tsx`
- `src/components/ui/PageNotFound.tsx`
- `src/components/table/DataTableRefreshButton.tsx` + `DataTableRowsPerPage.tsx`

**Peers 模块 (7 个)**：
- `src/modules/peers/PeersTable.tsx` — 9 列标题 + 4 按钮 + 5 tooltip
- `src/modules/peers/PeerActionCell.tsx` — 7 菜单项 + 动态 Disable/Enable
- `src/modules/peers/PeerMultiSelect.tsx` — 3 状态文本 + 帮助文本
- `src/modules/peer/MinimalPeersTable.tsx` — 4 列标题 + 3 过滤按钮
- `src/modules/peer/EphemeralPeerIndicator.tsx` — 临时节点提示
- `src/modules/peer/ExpirationDisabledIndicator.tsx` — 过期禁用提示
- `src/modules/peer/PeerExpirationToggle.tsx` — 权限提示 + 设置链接

**Users 模块 (6 个)**：
- `src/modules/users/UsersTable.tsx` — 5 列标题
- `src/modules/users/UserInvitesTable.tsx` — 5 列标题
- `src/modules/users/ServiceUsersTable.tsx` — 3 列标题
- `src/modules/users/ChangePasswordModal.tsx` — 6 字段标签 + 帮助文本
- `src/modules/users/UserInviteModal.tsx` — 部分标签
- `src/modules/users/UserPeersSection.tsx` — Peers 标题

**I18n 基础设施**：TransText 组件、LocaleProvider、trans-map（~2,645 条翻译）、build-trans-map.js

**编译**：`tsc --noEmit` 零错误

### 待汉化（约 205 个 .tsx 文件）

按优先级排列：
1. **Settings 模块** — `src/modules/settings/`（大部分 Tab，约 20 个文件）
2. **DNS / Networks / Groups / Policies** 等管理系统
3. **弹窗/Modal** — 各模块下的 Modal 文件
4. **Access Control / Posture Checks / Setup Keys / Activity** 等

## 汉化操作方法

### 翻译一个文本只需两步：

**Step 1 — 在组件中包裹 TransText：**

```tsx
import { TransText } from "@/i18n/trans-text";

// 改造前
<Button>Add Peer</Button>

// 改造后
<Button><TransText>Add Peer</TransText></Button>
```

**Step 2 — 如果 trans-map 中没有该翻译，添加到 en.ts/zh.ts 并重建：**

```bash
# 在 src/i18n/messages/en.ts 和 zh.ts 中添加对应条目
# 然后重新生成 trans-map
node scripts/build-trans-map.js
```

### 翻译规范
- 中文引号用「」，避免 TS 转义
- 参考术语表 `/home/lsj/workspace/project/NetBrid/i18n/TERMS.md`
- **不删除**英文原文，只在外面包 `<TransText>`
- **不修改** `trans-map.ts`（会被 build-trans-map.js 覆盖）
- **禁止用 Python 序列化翻译文件**（反斜杠加倍问题）
- **不对动态变量文本使用 TransText**（如 `Bypass {name} compliance check`），精确匹配无法工作
- **不对 notify/confirm 等 JS API 调用中的字符串使用 TransText**，仅包裹 JSX 文本节点

### 常用命令

```bash
# 编译检查
npx tsc --noEmit

# 检查 trans-map 中是否有某翻译
grep "'Add Peer'" src/i18n/trans-map.ts

# 查找某个模块中硬编码的英文
grep -rn '>[A-Z][a-z]' src/modules/settings/ --include="*.tsx" | grep -v 'className\|href\|TransText\|//'

# 重新生成翻译 map
node scripts/build-trans-map.js
```

## TransText 组件说明

- `<TransText>English Text</TransText>` — 在中文 locale 下自动翻译，英文 locale 下显示原文
- 开发环境下未翻译的文本会显示橙色虚线边框（方便发现遗漏）
- 不支持动态变量文本；对于带变量的模式（如 "Showing X to Y of Z"），保留原样或使用局部判断

## 本次会话目标

优先完成 Settings 模块的汉化：
1. Settings 各 Tab 页面（`src/modules/settings/`）
2. 然后 DNS / Networks / Policies 模块
3. 最后 Groups / Access Control / 其余模块

每批完成后运行 `npx tsc --noEmit` 验证。

## 术语参考

| English | 中文 |
|---------|------|
| Peer | 节点 |
| Route | 路由 |
| Exit Node | 出口节点 |
| Group | 组 |
| Policy | 策略 |
| Setup Key | 安装密钥 |
| Nameserver | DNS 服务器 |
| Posture Check | 安全态势检查 |
| Access Control | 访问控制 |
| Reverse Proxy | 反向代理 |
