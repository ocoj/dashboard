## 任务：继续 NetBird Dashboard 汉化 — 团队 & 设置菜单

请先阅读 `/home/lsj/workspace/project/NetBrid/NEXT_TASK.md`，里面有项目背景、踩坑记录和部署命令。下面补充本次任务的执行上下文。

---

### 1. 当前进度

已完成汉化：
- Control Center（控制中心）
- Peers（节点）
- Access Control（访问控制）— Policies / Groups / Posture Checks
- Network Routing（网络路由）— Networks / Routes
- Reverse Proxy（反向代理 Beta）— Services / Custom Domains / Clusters / Access Logs
- **DNS** — Nameservers / Zones / DNS Settings ✅ 本次完成

本次目标（两个菜单一起做）：
- **团队（Team）**，下属子页：
  - Users → 「用户」
  - Service Users → 「服务用户」
- **设置（Settings）**，下属子页：
  - 需先浏览器遍历确认具体子页结构（可能是单页设置表单或含多个 Tab）

---

### 2. 本次 DNS 汉化新增经验

**新增术语**：
- Nameserver → 「DNS 服务器」（非「名称服务器」）
- Zone → 「区域」
- DNS Settings → 「DNS 设置」

**本次踩坑**：

1. **sed 插入 key 时确认命名空间**：`addOrSelectGroups` 被误插入到 `peers` 命名空间（因为 `addGroups` 在那里），实际应在 `common`。插入前用 `awk 'NR<行号{ns=$1} NR==行号{print ns}'` 确认命名空间。

2. **`getTranslations()` 不带参数找不到特定命名空间的 key**：`zones/layout.tsx` 原来调用 `getTranslations()` 后 `t("dnsZones")` 找不到（因为 key 在 `dns` 命名空间），必须改为 `getTranslations("dns")`。

3. **Page title 需改 layout.tsx**：页面 `<title>` 由各子页的 `layout.tsx` 控制，硬编码英文需改为 `generateMetadata` + `getTranslations("正确的命名空间")`。

4. **Shared component 可改**：`PeerGroupSelector.tsx` 的默认 placeholder 是英文硬编码，可以引入 `useTranslations` 并 fallback 到 common key。注意 `placeholder` 作为 prop 默认值时不能直接调用 `t()`，需要在函数体内做 `placeholder ?? t("key")` 的 fallback。

5. **预设选项的描述用 i18n key 而非硬编码**：Google/Cloudflare/Quad9 DNS 的介绍硬编码在 `NameserverTemplateModal.tsx`，需提取为 key。

6. **`grep` 搜索遗漏是最可靠的方式**：每轮改完后 `grep -rn` 搜索已知英文关键词（如 "Delete", "Add", "Save" 等）确保无遗漏硬编码。

---

### 3. 技术栈速查

- 框架：next-intl（next-intl v3 静态导出模式）
- 翻译文件：`src/i18n/messages/zh.ts` 和 `en.ts`（各约 2500 行）
- 代码位置：`/home/lsj/workspace/project/NetBrid/netbird-dashboard/`
- 仓库：`ocoj/dashboard`，分支 `i18n-clean`
- 团队相关源码：`src/app/(dashboard)/team/` 及 `src/modules/team/`
- 设置相关源码：`src/app/(dashboard)/settings/` 及 `src/modules/settings/`

---

### 4. 浏览器验证

URL：`https://nb.lanxun.pro:30443`
登录凭据（Vaultwarden）：搜索 "netbird dashboard web"，邮箱 ***REMOVED***

切中文方法：
- Playwright 中执行：`document.cookie = 'NEXT_LOCALE=zh; path=/; domain=nb.lanxun.pro'` 后刷新
- 真机浏览器：右上角「选择语言」按钮

---

### 5. 逐菜单汉化工作流（严格按此执行）

```
1. [浏览器遍历]
   → 登录 Web → 点开目标菜单
   → _逐个子页_点击，每页遍历所有按钮、Tab、弹窗、表格、表头、筛选器
   → 弹窗内每个 Tab 都要点击查看
   → 创建/编辑弹窗中每个表单字段、下拉选项、placeholder 都要查看
   → 用 browser_snapshot 记录页面文字
   → 用 browser_console_messages level=error 搜索 MISSING_MESSAGE
   → 逐项记录所有英文字符串和 MISSING_MESSAGE，形成完整清单

2. [代码定位]
   → grep 定位每个英文 key/字符串的源文件和行号
   → 分类：
     - 缺 key 的（en.ts 也没有，或 zh.ts 没有对应项）
     - 有 key 但 zh.ts 未翻译的
     - 硬编码在 .tsx 中的
   → 制定修改顺序：先加 key → 再翻 key → 最后修硬编码

3. [进行汉化]
   → 第一步：用 sed 在 zh.ts/en.ts 中增减 key
     - 插入：sed -i '行号 a\    新行内容' zh.ts
     - 替换：sed -i '行号s/旧/新/' zh.ts
     - ⚠️ 每次 sed 后行号偏移，下一次 sed 前必须 grep 重新确认行号
     - ⚠️ 插入前用 awk 确认所在命名空间
   → 第二步：用 Edit 工具修复 .tsx 中的硬编码字符串
   → ⚠️ 中文引号用「」

4. [代码检查]
   → npx tsc --noEmit 确保零错误
   → grep 自查遗漏：搜索已知英文关键词
   → 补遗漏 → 再 tsc → 循环至零错误 + 零遗漏

5. [部署]
   → git add -A && git commit -m "i18n: xxx菜单汉化"
   → git push origin i18n-clean
   → 等待 CI 约 2 分钟
   → 一条命令部署（见第 7 节）

6. [浏览器复查]
   → 强制刷新（Ctrl+Shift+R 或 `location.reload(true)`）
   → 逐个点击每个子页、每个按钮、每个弹窗、每个 Tab
   → console 搜索 MISSING_MESSAGE（level=error）
   → 有遗漏 → 回到第 3 步
```

---

### 6. 修改翻译文件规则

- **只用 sed** 插入/替换，不用 Python 脚本
- 插入：`sed -i '行号 a\    新行内容' zh.ts`（注意 4 空格缩进）
- 替换：`sed -i '行号s/旧内容/新内容/' zh.ts`
- **全文替换**（如术语修正）：`sed -i 's/旧词/新词/g' zh.ts`
- ⚠️ **每次 sed 后行号偏移，下次 sed 前必须 grep 确认**
- ⚠️ **插入前用 `awk 'NR<行号{ns=$1} NR==行号{print ns}'` 确认命名空间**
- 中文引号用「」
- 改完立即 `npx tsc --noEmit`
- 先改 en.ts，再改 zh.ts，顺序一致避免结构差异

---

### 7. 部署命令

OMV compose.yml 已直接引用 GHCR 镜像，一条命令部署：

```bash
sshpass -p '***REMOVED***' ssh -o StrictHostKeyChecking=no root@***REMOVED*** \
  'cd /srv/dev-disk-by-uuid-ce634972-0546-4917-9354-ee5ae21d4190/Compose/netbird && \
   docker compose pull dashboard && docker compose up -d dashboard'
```

验证镜像：
```bash
sshpass -p '***REMOVED***' ssh root@***REMOVED*** \
  "docker inspect netbird-dashboard --format '{{.Config.Image}}'"
# 应输出: ghcr.io/ocoj/dashboard:i18n-clean
```

---

### 8. Git 操作

```bash
cd /home/lsj/workspace/project/NetBrid/netbird-dashboard
git remote set-url origin https://x-access-token:GITHUB_TOKEN_REDACTED@github.com/ocoj/dashboard.git
```

---

### 9. 术语统一参考

| English | 中文 |
|---------|------|
| Nameserver / DNS Server | DNS 服务器 |
| Zone | 区域 |
| DNS Settings | DNS 设置 |
| Peer | 节点 |
| Posture Check | 态势检查 |
| Masquerade | 地址伪装 |
| Setup Key | 设置密钥 |
| Group | 组 |
| Policy | 策略 |
| Route | 路由 |

---

### 10. 团队和设置菜单的预估注意点

- **团队（Team）**：
  - Users 页可能有：用户表格、邀请用户弹窗、编辑用户弹窗、角色选择、组分配
  - Service Users 页类似但有 Token/密钥管理

- **设置（Settings）**：
  - 可能是单页表单或含多个子页/Tab
  - 浏览器遍历时详细记录

---

请开始工作：先用浏览器登录 Web，点开「团队」菜单，遍历 Users 和 Service Users 两个子页的所有按钮、弹窗、Tab、表格、表单，记录所有英文字符串和 MISSING_MESSAGE。然后再遍历「设置」菜单。
