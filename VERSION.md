# 版本号规则

## 格式

```
上游版本-zh
```

- `上游版本` = NetBird Dashboard 上游 release 版本号（不含 `v` 前缀），如 `2.90.4`
- `-zh` = 汉化分支后缀，固定不变

## 显示效果

侧栏底部显示：`v2.90.4-zh`（`v` 前缀由 `formatVersion()` 自动添加）

## 版本号来源

```
package.json          →  "version": "2.90.4"      # 上游干净版本号
next.config.js         →  pkg.version + "-zh"       # 构建时自动追加 -zh
VersionInfo.tsx        →  formatVersion() 加 v 前缀  # 显示为 v2.90.4-zh
```

## 变更规则（红线）

| 操作 | 方法 |
|------|------|
| 同步上游新版本 | 修改 `package.json` 中 `version` 字段为上游版本号 |
| 本地补丁迭代 | 在上游版本不变时，追加 `.N`，如 `2.90.4.1-zh` |
| 禁止行为 | ❌ 直接改 `next.config.js` 中的版本字符串 |
| 禁止行为 | ❌ 使用非数字版本号（如 `development`） |
| 禁止行为 | ❌ 修改 `-zh` 后缀 |

## 校验

`next.config.js` 在构建时自动校验 `package.json` 的 `version` 字段是否符合 `x.y.z` 格式。不符合则构建失败。
