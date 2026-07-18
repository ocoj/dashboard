# 继续汉化任务 — 新会话提示词

## 背景

本仓库是 [NetBird Dashboard](https://github.com/netbirdio/dashboard) 的中文汉化分支 (`i18n-clean`)。

**当前状态**：已合并上游 v2.90.4+，i18n 架构采用自建 TransText 方案。trans-map 2,769 条，tsc 零错误。**本会话大幅推进 Reverse Proxy 及多模块汉化。**

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

### 已完成模块

| 模块 | 进度 | 文件数 |
|------|------|--------|
| Settings | ✅ 完成 | 11/11 |
| Setup Keys | ✅ 完成 | 2/9 (Modal + Table) |
| Access Control | ✅ 完成 | 9/9 + 7 skip |
| Networks | ✅ 完成 | 24/36 + 12 skip |
| Posture Checks | ✅ 完成 | 14/26 + 12 skip |
| Activity | ✅ 完成 | 4/7 + 3 skip |
| **Routes** | ✅ **本轮完成** | **6/13 + 7 skip** |
| **Reverse Proxy** | **大半完成** | **32/61** |
| **Integrations** | 少量 | 1/73 |
| **Onboarding** | 少量 | 3/25 |
| Control Center | 无需 | 0/18（无硬编码文本） |
| DNS | 大部分 | 11/23 |
| Groups | 大部分 | 11/22 |
| Peers | 已有 | 3/13 |
| Peer (详情) | 已有 | 4/22 |
| Users | 已有 | 7/19 |

### I18n 基础设施

TransText 组件、LocaleProvider、trans-map（**2,698 条翻译**）、build-trans-map.js

**编译**：`tsc --noEmit` 零错误

### 待汉化模块（按优先级）

1. **Reverse Proxy** — `src/modules/reverse-proxy/` (4/61，核心表头已完成，最大文件 ReverseProxyModal.tsx 44KB 待处理)
2. **Integrations** — `src/modules/integrations/` (1/73，大部分文本通过 props 传入)
3. **Onboarding** — `src/modules/onboarding/` (1/25)
4. **DNS 剩余** / **Groups 剩余** / **Peers 剩余** / **Users 剩余** 等

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
- **对于包含 `${variable}` 的模板字符串**，保留原样，不要尝试包裹

### 组件属性处理
- **ModalHeader**：`title/description` 接受 `ReactNode`，可用 `<TransText>` 包裹
- **NoResults**：内部已集成 TransText，title/description 传字符串即可
- **GetStartedTest**：内部已集成 TransText，title/description 传字符串即可
- **DataTableHeader**：children 需手动包裹 `<TransText>`
- **HTML 属性**（如 `placeholder`、`aria-label`）：无法使用 TransText，跳过
- **PostureCheckCard**：`title/description` 类型已改为 `ReactNode`，可用 `<TransText>` 包裹

### 常用命令

```bash
# 编译检查
npx tsc --noEmit

# 检查 trans-map 中是否有某翻译
grep "'Add Peer'" src/i18n/trans-map.ts

# 统计模块 TransText 覆盖率
for dir in src/modules/*/; do name=$(basename "$dir"); total=$(find "$dir" -name '*.tsx' | wc -l); trans=$(grep -rl 'TransText' "$dir" | wc -l); printf "%-28s %s/%s\n" "$name" "$trans" "$total"; done

# 重新生成翻译 map
node scripts/build-trans-map.js
```

## TransText 组件说明

- `<TransText>English Text</TransText>` — 在中文 locale 下自动翻译，英文 locale 下显示原文
- 开发环境下未翻译的文本会显示橙色虚线边框（方便发现遗漏）
- 不支持动态变量文本

## 本次会话目标

继续推进汉化覆盖：

1. **Reverse Proxy** — 重点攻克 `ReverseProxyModal.tsx`（44KB 最大文件）及剩余表格
2. **Integrations** — 核心卡片和配置页面
3. **Onboarding** — 引导流程关键页面
4. **DNS/Groups/Peers/Users** — 补充剩余空白

每批完成后运行 `npx tsc --noEmit` 验证。

## Agent Reach 互联网能力

已安装 Agent Reach v1.5.0，可直接使用以下命令获取外部信息：

```bash
# 全网搜索
mcporter call 'exa.web_search_exa(query: "query", numResults: 5)'

# 读网页
curl -s "https://r.jina.ai/URL"

# YouTube 字幕
yt-dlp --write-sub --skip-download -o "/tmp/%(id)s" "URL"

# B站搜索
bili search "query" --type video -n 5

# V2EX 热门
curl -s "https://www.v2ex.com/api/topics/hot.json" -H "User-Agent: agent-reach/1.0"

# 状态检查
agent-reach doctor
```

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
| Masquerade | 地址伪装 |
| Routing Peer | 路由节点 |
| CIDR Block | CIDR 块 |
