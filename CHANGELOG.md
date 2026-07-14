# 更新日志

## v2.90.3-zh (2026-07-14)

### 汉化收尾
- 修复 22 处组件硬编码英文（集成卡片描述、反代认证弹窗、任务气泡、LastTimeRow）
- 新增 18 个 i18n key（integrations/reverseProxy/common 命名空间）
- 修复 zh.ts 翻译质量：英文逗号→中文逗号、术语统一"对等节点"→"节点"
- "惰性连接"→"按需连接"、"Agent Network"→"客户端网络"
- "headless machines"→"无图形界面设备，如服务器和自主代理"
- globalMetaTitle → "NetBird 控制台"
- 公告横幅 announcements.json 中文化

### 工程
- Next.js 14 → 16.2.10（npm audit fix --force）
- npm 依赖漏洞 7 → 5（0 high）
- 重写中文 README + 修正 docker 端口/镜像说明
- 分支重整：i18n-clean 为主，删除 i18n-next/i18n-chinese
- GitHub Actions：push i18n-clean 自动构建 latest 镜像

### 安全
- 移除 git remote URL 中的明文 PAT
- 确认代码库无敏感信息泄露

