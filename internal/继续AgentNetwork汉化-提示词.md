# Agent Network 模块汉化续接提示词

> 当前状态：v2.90.7-zh，Providers 和 Policies 主页面已基本汉化。

## 已完成

| 页面 | 已汉化内容 |
|------|-----------|
| Providers | 标题(提供商)、描述、按钮(连接供应商)、API 基础 URL 标签、Copy、Agent 配置、空状态文本 |
| Policies | 标题(策略)、描述、添加策略按钮 |
| Usage & Logs | 标题、面包屑 |
| Configuration | 标题、面包屑 |

## 待汉化（按优先级）

### 1. Usage 页面板 (`src/modules/agent-network/AgentOverviewPanel.tsx`)
- "Total Tokens"、"Output Tokens"、"Request"、"Sessions"、"Cost (USD)" 等面板标签
- 需要添加 TransText import

### 2. Configuration 页 (`src/app/(dashboard)/agent-network/configuration/page.tsx`)
- "Proxy clusters route inbound traffic..." 集群描述
- Tab 标签 "Clusters"、"Global Limits"、"Log Collection"

### 3. 弹窗/模态框
- `AgentConnectModal.tsx` — "Configure Your Agent"、"Run in your shell:"、"Shell"
- `AIProviderModal.tsx` — "Upstream URL"、"Forward Identity Metadata" 等
- `AgentPolicyModal.tsx` — "Create Agent Policy" 及相关表单

### 4. 其余组件文件（15+ 个）
- 表格列头、空状态、确认弹窗等

## 工作方法

```
1. 浏览器遍历对应页面，记录所有显示英文的文本
2. 搜索源文件定位未包裹的英文：grep -rn "EnglishText" src/modules/agent-network/
3. 添加 zh-map 条目（按字母序插入 src/i18n/zh-map.ts）
   - ⚠️ 引号匹配陷阱：源码中的 curly quote `'` (U+2019) 和 regular quote `'` (U+0027) 是不同字符
   - TransText 做精确字符串匹配，zh-map key 必须与 JSX children 完全一致
   - 英文 key 中的单引号需用 `\'` 转义
4. 在组件中包裹 <TransText>（JSX children）或用 zhMap[key] 取值（string prop）
5. npx tsc --noEmit  → 必须零错误
6. git add -A && git commit && git push origin i18n-clean
7. 打 tag 触发 GitHub Actions 构建：
   git push origin :v2.90.7-zh && git tag -f v2.90.7-zh && git push origin v2.90.7-zh
8. OMV 部署：
   sshpass -p '<OMV密码>' ssh root@***REMOVED*** 'cd /srv/.../Compose/netbird && docker compose pull dashboard && docker compose up -d dashboard'
9. 浏览器验证
```

## 关键文件

| 文件 | 作用 |
|------|------|
| `src/i18n/zh-map.ts` | English→Chinese 平面映射（~2340 条目） |
| `src/i18n/trans-text.tsx` | `<TransText>` 组件 |
| `src/app/(dashboard)/agent-network/*/page.tsx` | 4 个页面文件 |
| `src/modules/agent-network/*.tsx` | 20 个组件文件 |

## 参考文档

- `internal/上游同步与汉化发布提示词.md` — 完整汉化 SOP
- 凭据：Vaultwarden MCP → `netbird Github Token`、`omv ssh`、`netbird dashboard web`
