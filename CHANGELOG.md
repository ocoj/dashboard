# 更改记录

## [v2.90.4-zh] — 2026-07-17

- 同步上游 netbirdio/dashboard #709/#710/#714/#717
  - Agent Network: clusters 视图 + dashboard_features 支持
  - RDP: Linux/FreeBSD 支持 + Display Control + 错误分类
  - 修复 IdP cards 间距
- 新增 14 个翻译 key，汉化配置页面和 RDP 凭证弹窗
- 版本策略：CI 用 `git describe --tags` 自动派生版本号，无需手动打 tag
- CI 优化：checkout fetch-depth:0 + 自动版本 + 文档更新

## [未发布]

- 初始化 NetBrid 汉化与部署项目
- Dashboard 汉化：10/10 模块全部完成（Peers、Access Control、Routes、Reverse Proxy、DNS、Team、Dashboard、Activity Logs、Settings、Integrations）
- OMV 部署：Docker Compose 部署方案设计完成
- 项目目录整理：合并 `netbird-dashboard-build` + `netbird-dashboard-cn` → `netbird-dashboard`
- i18n 资源整合：`zh_CN/` + `translations/` → `i18n/`
