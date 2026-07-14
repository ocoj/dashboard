# Cline 汉化会话标准工作流

> 每个主菜单独立开一个会话，避免上下文干扰。以下为每次会话的启动提示词模板和标准流程。

---

## 会话启动提示词模板

复制以下内容，替换 `{菜单名}` 和 `{具体任务}` 后，作为新会话的第一条消息：

```
## 任务：NetBird Dashboard 汉化 — {菜单名} 菜单

### 项目背景

- 仓库：github.com/ocoj/dashboard，分支 `i18n-clean`
- 部署：OMV ***REMOVED***，`https://nb.lanxun.pro:30443`
- 切中文：cookie `NEXT_LOCALE=zh`
- 翻译框架：next-intl，翻译文件 `src/i18n/messages/en.ts` 和 `zh.ts`
- 代码位置：`/home/lsj/workspace/project/NetBrid/netbird-dashboard/`
- 标准工作流详见：`netbird-dashboard/docs/SESSION_WORKFLOW.md`

### 凭据获取（通过 Vaultwarden MCP）

所有密码/Token 禁止硬编码或存本地，必须通过 Vaultwarden 获取：

| 用途 | Vaultwarden 搜索关键字 |
|------|----------------------|
| GitHub Token | `netbird Github Token` |
| OMV SSH 密码 | `omv ssh` |
| Web 登录凭据 | `netbird dashboard web` |

使用方法：`smartbw_get_password` 或 `smartbw_get_api` 获取对应凭据。

### 本次任务

{具体任务描述}

### 标准汉化工作流（严格按此执行）

#### 第 1 步：浏览器遍历记录
1. 登录 `https://nb.lanxun.pro:30443`，切到中文（cookie `NEXT_LOCALE=zh`）
2. 点开目标菜单，遍历所有子页、按钮、Tab、弹窗
3. 弹窗内每个 Tab 都要点击，每个表单字段、下拉选项、placeholder 都要查看
4. 对于多步向导（step-by-step），正常填写信息推进到下一步，检查每一步的英文
5. 按钮悬停提示（tooltip）也要检查
6. 浏览器控制台搜索 `MISSING_MESSAGE` 找缺失翻译
7. 记录所有发现的英文文本，形成完整清单

#### 第 2 步：代码定位与方案制定
1. grep 定位每个英文文本的源文件和行号
2. 分类：缺 key 的 / 有 key 但未翻译的 / 硬编码在 .tsx 中的
3. 制定修改顺序：先加 key → 再翻 key → 最后修硬编码

#### 第 3 步：进行汉化
- 翻译文件修改：
  - 插入：`sed -i '行号 a\    新行内容' zh.ts`（4 空格缩进）
  - 替换：`sed -i '行号s/旧/新/' zh.ts`
  - ⚠️ 每次 sed 后行号偏移，先 grep 确认行号
  - ⚠️ 插入前用 `awk 'NR<行号{ns=$1} NR==行号{print ns}'` 确认命名空间
  - 先改 en.ts，再改 zh.ts，结构一致
- 组件修改：修复 .tsx 中的硬编码字符串
- 中文引号用「」
- 禁 Python 脚本处理翻译文件

#### 第 4 步：代码级检查
1. `npx tsc --noEmit` 确保零错误
2. `grep -rn` 搜索已知英文关键词查遗漏
3. 补遗漏 → 再 tsc → 循环至零错误 + 零遗漏

#### 第 5 步：同步到 GitHub（触发自动构建）
1. ⚠️ 同步前必须执行脱敏审计（见下方「脱敏审计」章节）
2. 确认无敏感信息后，使用 Vaultwarden 获取 GitHub Token 进行 push：
   ```
   git add -A && git commit -m "i18n: {菜单名}汉化" && git push origin i18n-clean
   ```
3. GitHub Actions 自动构建 Docker 镜像 → `ghcr.io/ocoj/dashboard:latest`

#### 第 6 步：部署到 OMV（只拉取新镜像，不修改任何配置）
1. 从 Vaultwarden 获取 OMV SSH 密码（关键字：`omv ssh`）
2. 执行：
   ```bash
   sshpass -p '<从Vaultwarden获取的密码>' ssh -o StrictHostKeyChecking=no root@***REMOVED*** \
     'cd /srv/dev-disk-by-uuid-ce634972-0546-4917-9354-ee5ae21d4190/Compose/netbird && \
      docker compose pull dashboard && docker compose up -d dashboard'
   ```
3. ⚠️ 只执行 `pull` + `up -d`，不修改 docker-compose.yml 和任何配置

#### 第 7 步：真机验证
1. 强制刷新（Ctrl+Shift+R）
2. 逐项点击每个子页、按钮、弹窗、Tab
3. 控制台搜索 `MISSING_MESSAGE`
4. 有遗漏 → 回到第 3 步
```

---

## 安全红线

### 密码/Token 管理

- **所有密码/Token 必须通过 Vaultwarden MCP 获取，禁止硬编码或存本地**
- 使用 `smartbw_get_password` 或 `smartbw_get_api` 获取凭据
- 凭据用完即弃，不写入任何文件

| 用途 | Vaultwarden 搜索关键字 |
|------|----------------------|
| GitHub Token（push 用） | `netbird Github Token` |
| OMV SSH 密码 | `omv ssh` |
| Dashboard Web 登录 | `netbird dashboard web` |

### OMV 操作红线

- **只拉取镜像**：`docker compose pull dashboard && docker compose up -d dashboard`
- **禁止修改**：docker-compose.yml、端口映射、环境变量、网络配置等
- 容器名：`dashboard`，镜像：`ghcr.io/ocoj/dashboard:latest`

### 脱敏审计（同步 GitHub 前必做）

`netbird-dashboard/docs/` 目录含敏感信息，**已在 `.gitignore` 中排除**，不会同步到 GitHub。

```bash
cd /home/lsj/workspace/project/NetBrid

# 检查待提交文件中是否包含敏感信息
grep -rn '***REMOVED***\|GITHUB_TOKEN_REDACTED\|192\.168\.110\|ocoj@163\|x-access-token' \
  --include='*.md' --include='*.sh' --include='*.json' --include='*.yml' \
  netbird-dashboard/ i18n/ 2>/dev/null | grep -v node_modules | grep -v '.git/'

# 确认 git status 中 docs/ 和 backups/ 不在待提交列表
git status
```

### 已标记不同步的目录

| 目录 | 原因 |
|------|------|
| `netbird-dashboard/docs/` | 含 SSH 密码、IP、GitHub Token |
| `i18n/backups/` | 翻译备份，非必要同步 |

---

## 部署命令（模板）

实际执行时，密码通过 Vaultwarden MCP 获取，不硬编码。

```bash
# OMV 部署（只拉镜像，不动配置）
sshpass -p '<VAULTWARDEN: omv ssh>' ssh -o StrictHostKeyChecking=no root@***REMOVED*** \
  'cd /srv/dev-disk-by-uuid-ce634972-0546-4917-9354-ee5ae21d4190/Compose/netbird && \
   docker compose pull dashboard && docker compose up -d dashboard'

# 手动构建镜像（如果等不及 GitHub Actions）
cd /home/lsj/workspace/project/NetBrid/netbird-dashboard
docker build -t ghcr.io/ocoj/dashboard:latest . && docker push ghcr.io/ocoj/dashboard:latest
```

---

## 代码检查

```bash
cd /home/lsj/workspace/project/NetBrid/netbird-dashboard
npx tsc --noEmit
```

---

## 术语统一参考

| English | 中文 |
|---------|------|
| Peer | 节点 |
| Route | 路由 |
| Nameserver / DNS Server | DNS 服务器 |
| Zone | 区域 |
| Setup Key | 设置密钥 |
| Posture Check | 态势检查 |
| Masquerade | 地址伪装 |
| Group | 组 |
| Policy | 策略 |
| Exit Node | 出口节点 |
| Metrics | 性能指标 |
| Lazy Connections | 按需连接 |

---

## 踩坑记录

1. 新增 namespace 需类型匹配：en.ts/zh.ts 结构必须一致，否则 tsc 报 TS2741
2. sed 在指定行之后插入，非之前
3. 组件中硬编码的英文 tsc 不会报错，只有运行时才能发现
4. 非组件工具函数不能直接用 hook，需添加可选 `t` 参数做 fallback
5. `t()` 的 params 值不能是 `undefined`，需要 `|| ""` 兜底
6. 绝不用 Python 序列化脚本重写 zh.ts/en.ts，会破坏转义符
7. 浏览器缓存：部署后 Ctrl+Shift+R 强制刷新
8. 密码/Token 不存本地，不上传外网，通过 Vaultwarden MCP 获取
9. OMV 只更新 dashboard 镜像，不动 docker-compose 和配置