## 任务：NetBird Dashboard 汉化 — 网络路由 菜单补充翻译 + 设置菜单修正

### 项目背景

- 仓库：github.com/ocoj/dashboard，分支 `i18n-clean`
- 部署：OMV ***REMOVED***，`https://nb.lanxun.pro:30443`
- 切中文：cookie `NEXT_LOCALE=zh`
- 翻译框架：next-intl，翻译文件 `src/i18n/messages/en.ts` 和 `zh.ts`
- 代码位置：`/home/lsj/workspace/project/NetBrid/netbird-dashboard/`
- 标准工作流详见：`netbird-dashboard/docs/SESSION_WORKFLOW.md`

### 凭据获取（通过 Vaultwarden MCP）

所有密码/Token 禁止硬编码或存本地：

| 用途 | Vaultwarden 搜索关键字 |
|------|----------------------|
| GitHub Token | `netbird Github Token` |
| OMV SSH 密码 | `omv ssh` |
| Web 登录凭据 | `netbird dashboard web` |

### 本次任务

#### A. 网络路由菜单补充翻译

对「网络路由」菜单进行深度复查，重点检查：

1. **「添加出口节点」按钮** — 悬停提示（tooltip）的帮助信息
2. **所有二级/三级弹窗** — 逐个点击打开，检查每个弹窗内的英文文本
3. **多 Tab 步进设置向导** — 正常模拟填写信息推进到下一步，检查每一步的英文界面
4. **表格列头、空状态提示、筛选器** — 检查遗漏

#### B. 设置菜单修正

1. **设置 → 指标**：Tab 名「指标」和内容标题全部改为「性能指标」
2. **设置 → 安装密钥 → 创建安装密钥**：弹窗和二级弹窗的 Tab 页面全面检查遗漏

### 标准汉化工作流（严格按此执行）

#### 第 1 步：浏览器遍历记录
1. 登录 `https://nb.lanxun.pro:30443`，切到中文（cookie `NEXT_LOCALE=zh`）
2. 点开「网络路由」菜单，遍历所有子页、按钮、Tab、弹窗
3. 弹窗内每个 Tab 都要点击，每个表单字段、下拉选项、placeholder 都要查看
4. 对于多步向导（step-by-step），正常填写信息推进到下一步，检查每一步的英文
5. 按钮悬停提示（tooltip）也要检查
6. 浏览器控制台搜索 `MISSING_MESSAGE` 找缺失翻译
7. 记录所有发现的英文文本，形成完整清单

然后再检查「设置」菜单：
1. 点开「设置」→「指标」Tab，确认是否已翻译为「性能指标」
2. 点开「设置」→「安装密钥」→「创建安装密钥」，遍历弹窗内所有 Tab 和字段

#### 第 2 步：代码定位与方案制定
1. grep 定位每个英文文本的源文件和行号
2. 分类：缺 key 的 / 有 key 但未翻译的 / 硬编码在 .tsx 中的
3. 制定修改顺序：先加 key → 再翻 key → 最后修硬编码

#### 第 3 步：进行汉化
- 翻译文件修改：sed 插入/替换 zh.ts 和 en.ts
- 组件修改：修复 .tsx 中的硬编码字符串
- 中文引号用「」，禁 Python 脚本处理翻译文件

#### 第 4 步：代码级检查
1. `npx tsc --noEmit` 确保零错误
2. `grep -rn` 搜索已知英文关键词查遗漏
3. 补遗漏 → 再 tsc → 循环至零错误 + 零遗漏

#### 第 5 步：同步到 GitHub（触发 GitHub Actions 自动构建镜像）
1. ⚠️ 同步前必须执行脱敏审计
2. 从 Vaultwarden 获取 GitHub Token（关键字：`netbird Github Token`）
3. `git add -A && git commit -m "i18n: 网络路由+设置修正" && git push origin i18n-clean`
4. GitHub Actions 自动构建 Docker 镜像 → `ghcr.io/ocoj/dashboard:latest`

#### 第 6 步：部署到 OMV（只拉取新镜像，不修改任何配置）
1. 从 Vaultwarden 获取 OMV SSH 密码（关键字：`omv ssh`）
2. 执行：
   ```bash
   sshpass -p '<VAULTWARDEN密码>' ssh -o StrictHostKeyChecking=no root@***REMOVED*** \
     'cd /srv/dev-disk-by-uuid-ce634972-0546-4917-9354-ee5ae21d4190/Compose/netbird && \
      docker compose pull dashboard && docker compose up -d dashboard'
   ```
3. ⚠️ 只执行 `pull` + `up -d`，不修改 docker-compose.yml 和任何配置

#### 第 7 步：真机验证
1. 强制刷新（Ctrl+Shift+R）
2. 逐项点击每个子页、按钮、弹窗、Tab
3. 控制台搜索 `MISSING_MESSAGE`
4. 有遗漏 → 回到第 3 步

### 关键文件路径

| 文件 | 内容 |
|------|------|
| `src/i18n/messages/en.ts` | 英文翻译 key |
| `src/i18n/messages/zh.ts` | 中文翻译 |
| `src/modules/routes/` | 网络路由组件 |
| `src/modules/settings/MetricsTab.tsx` | 指标 Tab |
| `src/modules/settings/SetupKeysTab.tsx` | 安装密钥 Tab |
| `src/modules/networks/` | 网络管理组件 |

### 术语统一参考

| English | 中文 |
|---------|------|
| Route | 路由 |
| Exit Node | 出口节点 |
| Peer | 节点 |
| Masquerade | 地址伪装 |
| Setup Key | 设置密钥 |
| Metrics | 性能指标 |
| Group | 组 |
| Policy | 策略 |
| Nameserver | DNS 服务器 |

### 踩坑速查

1. 新增 namespace 需 en.ts/zh.ts 结构一致，否则 tsc 报 TS2741
2. sed 每次执行后行号偏移，必须重新 grep 确认
3. 组件硬编码英文 tsc 不会报错，只有运行时能发现
4. 非组件工具函数不能直接用 hook，需添加可选 `t` 参数做 fallback
5. `t()` 的 params 值不能是 `undefined`，需要 `|| ""` 兜底
6. 绝不用 Python 序列化脚本重写翻译文件，会破坏转义符
7. 部署后 Ctrl+Shift+R 强制刷新清除缓存
8. 密码/Token 不存本地，不上传外网，通过 Vaultwarden MCP 获取
9. OMV 只更新 dashboard 镜像，不动 docker-compose 和配置