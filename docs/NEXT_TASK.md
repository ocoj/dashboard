## 接续任务：设置菜单深度汉化 & 其他遗漏

### 项目状态

- 仓库：`ocoj/dashboard`，分支 `i18n-clean`
- 部署：OMV ***REMOVED***，`https://nb.lanxun.pro:30443`
- 切中文：cookie `NEXT_LOCALE=zh`
- SSH：`sshpass -p '***REMOVED***' ssh -o StrictHostKeyChecking=no root@***REMOVED***`
- i18n 文件：`src/i18n/messages/en.ts` 和 `zh.ts`
- 翻译库：`next-intl`，使用 `useTranslations(namespace)` hook

### 已完成

- [x] **Control Center / Peers / Access Control / Network Routing / Reverse Proxy / DNS**
- [x] **团队（Team）** — Users / Service Users
- [x] **设置（Settings）** — 9 个 Tab 初步汉化（Tab 名 + 主要字段）
- [x] **事件（Activity）** — 审计事件 + 流量事件 + EventStreamingCard
- [x] **集成（Integrations）** — Tab 名 / 描述 / 卡片
- [x] **共享组件** — LockedFeatureContent / TrialOrUpgradeButton / DatePickerWithRange / IntegrationCard / PLAN_TEXT
- [x] **筛选器弹窗** — ActivityEventCodeSelector / ActivityTypePicker / UsersDropdownSelector

### 本次目标

**注意：设置菜单虽然初步汉化了 9 个 Tab，但每个 Tab 的二级/三级弹窗中还有大量遗漏，需要逐项排查。**

#### 1. 设置菜单深度重查

Settings 页面（`src/app/(dashboard)/settings/page.tsx`）包含以下 Tab，每个都需逐项点击、弹窗查看：

| Tab | 组件文件 | 需要检查的弹窗/子页面 |
|-----|---------|-------------------|
| **Authentication** | `src/modules/settings/AuthenticationTab.tsx` | 密码修改弹窗、2FA 弹窗、session expiration 弹窗 |
| **Setup Keys** | `src/modules/settings/SetupKeysTab.tsx` | 创建/编辑密钥弹窗、撤销确认弹窗、自动分配组弹窗 |
| **Identity Providers** | `src/modules/settings/IdentityProvidersTab.tsx` + `IdentityProviderModal.tsx` | 添加/编辑 IdP 弹窗（Client ID, Client Secret, Issuer URL 等字段） |
| **Groups** | `src/modules/settings/GroupsSettings.tsx` | 与 groups 模块的联动弹窗 |
| **Permissions** | `src/modules/settings/PermissionsTab.tsx` | 角色权限编辑弹窗 |
| **Networks** | `src/modules/settings/NetworkSettingsTab.tsx` | 网络范围/IPv6/DNS 弹窗 |
| **Clients** | `src/modules/settings/ClientSettingsTab.tsx` | 自动更新/peer expose 弹窗 |
| **Metrics** | `src/modules/settings/MetricsTab.tsx` | 指标设置弹窗 |
| **Danger Zone** | `src/modules/settings/DangerZoneTab.tsx` | 删除账户确认弹窗 |
| **Plans & Billing** (Cloud) | `src/modules/billing/PlansAndBillingTab.tsx` | 计划升级弹窗、计费信息 |
| **Notifications** (Cloud) | `src/cloud/notifications/NotificationTab.tsx` | Email/Slack/Webhook 弹窗 |
| **Invoices** (Cloud) | `src/cloud/invoices/InvoicesTab.tsx` | 发票下载弹窗 |
| **Language** | `src/modules/settings/LanguageTab.tsx` | 语言选择器 |

#### 2. 其他可能遗漏的区域

- **导航侧边栏** — 所有菜单项、子菜单项
- **面包屑导航** — 页面标题/breadcrumb
- **表格列头** — 所有 DataTable 的列头
- **空状态提示** — No X available / No X yet 等
- **Toast 通知** — 成功/失败/加载中的提示

---

### 优化工作流（逐菜单汉化）

每个菜单/模块严格按以下 6 步执行：

```
1. 真机登录 web 后台，选定一个菜单，遍历所有子页、按钮、弹窗
   逐项点击细查：子菜单 → 子页面 → 按钮 → Tab → 表格项 → 表头
   在 zh_CN/漏译清单.md 中记录所有发现的英文文本

2. 查代码结构，对每条漏译文本定位源文件和行号
   制定汉化顺序：先加 namespace key → 后改组件引用

3. 进行汉化：
   a. 在 en.ts 中添加新的翻译 key
   b. 在 zh.ts 中添加对应中文翻译
   c. 在组件中使用 useTranslations() + t("key") 替换硬编码文本

4. 代码级检查：grep 搜索该组件/模块中是否还有未被 t() 包裹的英文
   字符串，补全遗漏，再复核

5. 部署到 OMV 服务器

6. 真机登录 web 后台验证：逐项点击每个子项、弹窗
   如有遗漏 → 跳回第 3 步重做
```

### 关键文件

| 文件 | 内容 |
|------|------|
| `src/i18n/messages/en.ts` | 英文翻译 key |
| `src/i18n/messages/zh.ts` | 中文翻译 |
| `src/app/(dashboard)/settings/page.tsx` | 设置页面主框架 |
| `src/modules/settings/AuthenticationTab.tsx` | 认证 Tab |
| `src/modules/settings/SetupKeysTab.tsx` | 安装密钥 Tab |
| `src/modules/settings/IdentityProvidersTab.tsx` | IdP Tab |
| `src/modules/settings/IdentityProviderModal.tsx` | IdP 添加/编辑弹窗 |
| `src/modules/settings/GroupsSettings.tsx` | 组设置 |
| `src/modules/settings/PermissionsTab.tsx` | 权限 Tab |
| `src/modules/settings/NetworkSettingsTab.tsx` | 网络设置 Tab |
| `src/modules/settings/ClientSettingsTab.tsx` | 客户端设置 Tab |
| `src/modules/settings/MetricsTab.tsx` | 指标 Tab |
| `src/modules/settings/DangerZoneTab.tsx` | 危险区域 Tab |
| `src/modules/settings/LanguageTab.tsx` | 语言 Tab |
| `src/cloud/settings/CloudSettings.tsx` | Cloud 设置（Plans/Billing/Notifications/Invoices） |
| `src/modules/billing/PlansAndBillingTab.tsx` | 计划与账单 |
| `src/cloud/notifications/NotificationTab.tsx` | 通知设置 |
| `src/cloud/mfa/AccountMFASettings.tsx` | MFA 设置弹窗 |
| `zh_CN/` 目录 | 记录漏译清单的工作目录 |

### 部署命令

```bash
# 1. 本地合并翻译文件（如果有 zh_CN 补丁）：
cd /home/lsj/workspace/project/NetBrid/netbird-dashboard && bash merge-zh.sh

# 2. 构建并推送：
cd /home/lsj/workspace/project/NetBrid/netbird-dashboard && \
  docker build -t registry.lanxun.pro:30500/netbird-dashboard:latest . && \
  docker push registry.lanxun.pro:30500/netbird-dashboard:latest

# 3. SSH 到 OMV 重启服务：
sshpass -p '***REMOVED***' ssh -o StrictHostKeyChecking=no root@***REMOVED*** \
  'cd /srv/dev-disk-by-uuid-ce634972-0546-4917-9354-ee5ae21d4190/Compose/netbird && \
   docker compose stop dashboard && docker compose rm -f dashboard && \
   docker compose pull dashboard && docker compose up -d dashboard'
```

### 踩坑记录

1. 新增 namespace 需类型匹配：en.ts/zh.ts 中新增顶层命名空间时，两文件结构必须一致，否则 tsc 报 TS2741。
2. `sed '行号r file'` 在指定行之后插入，非之前。
3. 组件中硬编码的英文会被 `tsc --noEmit` 放行，只有运行时才能发现漏译。
4. 非组件工具函数（如 `dateRangePresetLabel`）不能直接用 hook，需添加可选 `t` 参数做 fallback。
5. `t()` 的 params 值不能是 `undefined`，需要 `|| ""` 兜底。
